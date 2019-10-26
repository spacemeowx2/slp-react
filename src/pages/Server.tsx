import './Server.less'
import React, { useState } from 'react'
import { useLanPlay } from 'slp'
import { List, Icon, NavBar, SegmentedControl } from 'antd-mobile'
import { chain } from 'utils/chain'
import { PlusIcon } from 'components/PlusIcon'

const values = ['Relay', 'Proxy']

export const SelectableItem: React.FC<{
  selected: boolean
}> = ({ selected, children }) => <>
  <List.Item extra={selected && <Icon type='check-circle'/>}>{children}</List.Item>
</>

export const Server: React.FC = () => {
  const [ type, setType ] = useState('Relay')
  const isRelay = type === 'Relay'
  const ctx = useLanPlay()
  const { data } = ctx

  const socks5Server = chain(() => data.config!.socks5Server)

  return <div className='server-page'>
    <NavBar
      mode='light'
      rightContent={<PlusIcon />}
    >
      <SegmentedControl values={values} onValueChange={setType} />
    </NavBar>
    {
      isRelay ? <>

      </> : <>
        <List>
          {socks5Server}
          <SelectableItem selected={true}>Direct</SelectableItem>
        </List>
      </>
    }
  </div>
}
