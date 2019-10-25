
import { LPTransport, SendFunc } from './lan-play'

const notReady: SendFunc = () => { throw new Error('send not ready') }

export class LPTransportWS implements LPTransport {
  _url: string
  _lastUrl: string
  ws?: WebSocket
  onInit!: () => void
  onData!: (data: any) => void
  onError!: (err: any) => void
  onOpen!: () => void
  onClose!: () => void
  getSend!: (send: SendFunc) => void
  constructor ({ url }: { url: string }) {
    this._url = url
    this._lastUrl = ''
  }
  connect = () => {
    if (this.ws) {
      if (this.ws.readyState === this.ws.OPEN) {
        return
      }
    }
    this._connect()
  }
  private _close () {
    if (this.ws) {
      this.ws.close()
    }
  }
  private _connect () {
    this._close()
    this.init(this.url)
  }
  private async init (url: string) {
    if (!url) return
    this.onInit()
    this.getSend(notReady)
    try {
      const ws = new WebSocket(url, ['switch-lan-play-rpc'])
      this.ws = ws
      ws.onopen = () => {
        if (this.ws !== ws) return console.warn('detathed event open')
        this._lastUrl = url
        this.getSend((data) => ws.send(data))
        this.onOpen()
      }
      ws.onclose = () => {
        if (this.ws !== ws) return console.warn('detathed event close')
        this.onClose()
      }
      ws.onerror = (e) => {
        if (this.ws !== ws) return console.warn('detathed event error', e)
        this.onError(e)
      }
      ws.onmessage = ({ data }) => {
        if (this.ws !== ws) return console.warn('detathed event data')
        this.onData(data)
      }
    } catch (e) {
      return
    }
  }
  get url () {
    return this._url
  }
  set url (url: string) {
    const { url: lastUrl } = this
    if (lastUrl !== url) {
      this._url = url
      this._connect()
    }
  }
}
