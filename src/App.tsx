import React from 'react'
import { Button } from 'antd-mobile'
import { SwitchLanPlayProvider } from './slp/SwitchLanPlayProvider'
import { slpClient } from './globalSLPClient'

const Providers: React.FC = ({children}) => <SwitchLanPlayProvider client={slpClient}>
  {children}
</SwitchLanPlayProvider>

const App: React.FC = () => {
  return (
    <Providers>
      <div className="App">
        <Button type='primary'>hello world</Button>
      </div>
    </Providers>
  )
}

export default App;
