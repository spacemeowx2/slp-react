import React from 'react'
import { LanPlayProviderProps, LanPlayContextValue, SLPContext, defaultValue } from '../slp/context'
import { SwitchLanPlayClient, LPLanPlayContext } from '../slp/lan-play'

export class SwitchLanPlayProvider extends React.Component<LanPlayProviderProps, LanPlayContextValue> {
  state: LanPlayContextValue = {
    ...defaultValue,
    client: this.props.client
  }
  private unload: Function[] = []
  componentDidMount () {
    this.setState(this.props.client.getState())
  }
  render () {
    return <SLPContext.Provider value={this.state}>
      { this.props.children }
    </SLPContext.Provider>
  }
  private handleData = (s: LPLanPlayContext) => {
    this.setState(s)
  }
  private bind (client: SwitchLanPlayClient) {
    this.unbind()
    this.unload.push(client.onChange(this.handleData))
  }
  private unbind () {
    for (const f of this.unload) {
      f()
    }
    this.unload = []
  }
  componentWillMount () {
    this.bind(this.props.client)
  }
  componentWillReceiveProps (nextProps: LanPlayProviderProps) {
    const { client: newClient } = nextProps
    const { client } = this.props
    if (client !== newClient) {
      this.bind(newClient)
      this.setState({
        client: newClient
      })
    }
  }
}
