import { createContext, Component } from 'react'
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
export const SLPContext = createContext<LanPlayContextValue>({...defaultValue})

export class LanPlayComponent<P = {}, S = {}, SS = {}> extends Component<P, S, SS> {
  static contextType = SLPContext
  context!: LanPlayContextValue
}

interface LanPlayEventProps {
  onConnect: CallbackFunc
}

export class LanPlayEvent extends LanPlayComponent<LanPlayEventProps> {
  _unload: Function[] = []
  componentWillMount () {
    const client = this.context.client
    if (client) {
      this._unload.push(client.onConnect(e => {
        this.props.onConnect(e)
      }))
    }
  }
  componentWillUnmount () {
    for (const f of this._unload) {
      f()
    }
  }
  render () {
    return JSON.stringify(this.context, null, 2)
  }
}
