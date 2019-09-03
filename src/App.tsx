import React from 'react'
// import enUS from 'antd-mobile/es/locale-provider/en_US'
import { Button, LocaleProvider } from 'antd-mobile'
import { SwitchLanPlayProvider } from './slp/SwitchLanPlayProvider'
import { slpClient } from './globalSLPClient'

const Providers: React.FC = ({children}) => <>
  <LocaleProvider locale={{}}>
    <SwitchLanPlayProvider client={slpClient}>
      {children}
    </SwitchLanPlayProvider>
  </LocaleProvider>
</>

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
