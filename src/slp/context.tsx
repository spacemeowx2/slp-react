import React, { useContext } from 'react'
import { SwitchLanPlayClient } from './lan-play'
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

export const useLanPlay = () => useContext(SLPContext)
