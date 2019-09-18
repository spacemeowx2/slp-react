import React from 'react'
// import enUS from 'antd-mobile/es/locale-provider/en_US'
import { LocaleProvider } from 'antd-mobile'
import { SwitchLanPlayProvider } from './slp/SwitchLanPlayProvider'
import { slpClient } from './globalSLPClient'
import { NavTabs } from './pages/NavTabs'

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
        <NavTabs />
      </div>
    </Providers>
  )
}

export default App
