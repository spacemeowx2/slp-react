import { SwitchLanPlayClient } from './slp'
import { LPTransportWS } from './slp/lp-transport-ws'

export const slpClient = new SwitchLanPlayClient(new LPTransportWS({ url: '' }))
let rpcServer = localStorage.getItem('rpcServer') || `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}/`

slpClient.transport.url = rpcServer
console.log('rpcServer', rpcServer)
if (rpcServer === '') {
  // goto selection

}
slpClient.onConnect(() => {
  slpClient.send('status')
  slpClient.send('config')
  slpClient.send('lastConfig')
  localStorage.setItem('rpcServer', slpClient.transport.url)
})
let id: NodeJS.Timeout
slpClient.onClose(() => {
  if (id) {
    clearTimeout(id)
  }
  id = setTimeout(() => {
    slpClient.transport.connect()
  }, 5000)
})
