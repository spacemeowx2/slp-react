import React from 'react'
import { SwitchLanPlayClient, CallbackFunc } from './lan-play'
import { LPAllState } from './types'

type SendFunc = (c: string | ArrayBuffer) => void
const notReady: SendFunc = () => { throw new Error('send not ready') }

export interface LanPlayProviderProps {
  client: SwitchLanPlayClient
  children: any
}

export interface LanPlayContextValue {
  loading: boolean
  connected: boolean
  error?: any
  data: Partial<LPAllState>
  send: SendFunc
  client: SwitchLanPlayClient | null
}

export const defaultValue = {
  loading: false,
  connected: false,
  data: {},
  send: notReady,
  client: null
}
export const SLPContext = React.createContext<LanPlayContextValue>({...defaultValue})

class LanPlayComponentInner<P = {}, S = {}, SS = {}> extends React.Component<P, S, SS> {
  static contextType = SLPContext
  context!: LanPlayContextValue
}

export class LanPlayComponent extends LanPlayComponentInner<{ children: (ctx: LanPlayContextValue) => React.ReactNode }> {
  render () {
    return this.props.children(this.context)
  }
}

interface LanPlayEventProps {
  onConnect: CallbackFunc
}

export class LanPlayEvent extends LanPlayComponentInner<LanPlayEventProps> {
  _unload: Function[] = []
  componentDidMount () {
    const client = this.context.client
    if (client) {
      this._unload.push(client.onConnect(e => {
        this.props.onConnect(e)
      }))
    }
  }
  componentDidUnmount () {
    for (const f of this._unload) {
      f()
    }
  }
  render () {
    return JSON.stringify(this.context, null, 2)
  }
}
