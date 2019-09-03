import { LPAllState } from './types'
import { parseToml } from './util'

export interface LPFrame {
  error?: string
}

export type SendFunc = (c: string | ArrayBuffer) => void
export interface LPTransport {
  url?: string
  connect: () => void
  onInit: () => void
  onData: (data: any) => void
  onError: (err: any) => void
  onOpen: () => void
  onClose: () => void
  getSend: (send: SendFunc) => void
}

export interface LanPlayProps {
  token: string
  url: string
  onData?: (data: any, ctx: Readonly<LPLanPlayContext>) => void
  onError?: (err: any, ctx: Readonly<LPLanPlayContext>) => void
  onConnect?: (ctx: Readonly<LPLanPlayContext>) => void
  children: (ctx: Readonly<LPLanPlayContext>) => any
}

export interface LanPlayState {
  loading: boolean
  connected: boolean
  error?: any
  data: Partial<LPAllState>
}

export interface LPLanPlayContext extends LanPlayState {
  send: SendFunc
}

export type CallbackFunc = (c: LPLanPlayContext) => any
const notReady: SendFunc = () => { throw new Error('send not ready') }

export class SwitchLanPlayClient {
  private _queue: (string | ArrayBuffer)[] = []
  private _onData = new Set<CallbackFunc>()
  private _onError = new Set<CallbackFunc>()
  private _onConnect = new Set<CallbackFunc>()
  private _onChange = new Set<CallbackFunc>()
  private _onClose = new Set<CallbackFunc>()
  private _waitAuth = false
  private _send = notReady
  private _token = ''
  private _transport: LPTransport
  private _state: LPLanPlayContext = {
    loading: false,
    connected: false,
    data: {},
    send: notReady,
  }
  constructor (transport: LPTransport) {
    this._transport = transport
    this.transportChanged()
    this._setState({
      send: this.send
    })
  }
  onData (f: CallbackFunc) {
    this._onData.add(f)
    return () => this._onData.delete(f)
  }
  onError (f: CallbackFunc) {
    this._onError.add(f)
    return () => this._onError.delete(f)
  }
  onConnect (f: CallbackFunc) {
    this._onConnect.add(f)
    return () => this._onConnect.delete(f)
  }
  onChange (f: CallbackFunc) {
    this._onChange.add(f)
    return () => this._onChange.delete(f)
  }
  onClose (f: CallbackFunc) {
    this._onClose.add(f)
    return () => this._onClose.delete(f)
  }
  get token () {
    return this._token
  }
  set token (v: string) {
    const oldToken = this._token
    this._token = v
    if (v !== oldToken) {
      this.transportChanged()
    }
  }
  get transport () {
    return this._transport
  }
  set transport (v: LPTransport) {
    const oldTransport = this._transport
    this._transport = v
    if (v !== oldTransport) {
      this.transportChanged()
    }
  }
  private _setState (s: Partial<LPLanPlayContext>) {
    Object.assign(this._state, s)
    for (const f of this._onChange) f(this._state)
  }
  private transportChanged () {
    const { transport } = this
    transport.onInit  = this._handleInit
    transport.onOpen  = this._handleOpen
    transport.onData  = this._handleData
    transport.onClose = this._handleClose
    transport.onError = this._handleError
    transport.getSend = this._getSend
    transport.connect()
  }
  private clearQueue () {
    for (const f of this._queue) {
      this._send(f)
    }
    this._queue = []
  }
  private _handleInit = () => {
    this._setState({
      loading: true,
      connected: false,
      error: undefined
    })
    this._waitAuth = true
  }
  private _handleData = (data: string) => {
    const { _onData, _onError, _onConnect } = this

    const resp = parseToml(data) as LPFrame
    if (this._waitAuth) {
      if (typeof resp.error !== 'string') {
        this._waitAuth = false
        this._setState({
          loading: false,
          connected: true
        })
        this.clearQueue()
        for (const f of _onConnect) f(this._state)
      } else {
        console.warn('auth failed')
        this._setState({
          loading: false,
          connected: false,
          error: resp.error
        })
      }
    } else {
      if (typeof resp.error !== 'string') {
        for (const f of _onData) f(this._state)
        this._setState({
          loading: false,
          data: {
            ...this._state.data,
            ...resp as any
          }
        })
      } else {
        this._setState({
          loading: false,
          error: resp.error
        })
        _onError.forEach(f => f(this._state))
      }
    }
  }
  private _handleOpen = () => {
    this._send(this.token || '')
  }
  private _handleError = (err: any) => {
    this._waitAuth = false
    this._send = notReady
    this._setState({
      loading: false,
      connected: false,
      error: err
    })
  }
  private _handleClose = () => {
    this._waitAuth = false
    this._send = notReady
    this._setState({
      loading: false,
      connected: false,
      error: undefined,
    })
    for (const f of this._onClose) f(this._state)
  }
  private _getSend = (send: SendFunc) => {
    this._send = send
    this._setState({
      send: this.send
    })
  }
  getState () {
    return this._state
  }
  send: SendFunc = (c) => {
    if (this._state.connected) {
      this._setState({
        loading: true
      })
      this._send(c)
    } else {
      this._queue.push(c)
    }
  }
  set = (k: string, v: string) => {
    this.send(`${k}=${v}`)
  }
}
