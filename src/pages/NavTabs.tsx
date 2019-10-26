import React, { useState } from 'react'
import { TabBar } from 'antd-mobile'
import StatusIcon from 'images/status.png'
import StatusSelIcon from 'images/status_selected.png'
import ServerIcon from 'images/server.png'
import ServerSelIcon from 'images/server_selected.png'
import ConfigIcon from 'images/configure.png'
import ConfigSelIcon from 'images/configure_selected.png'
import { useLanPlay } from 'slp'
import { Status } from './Status'
import { Server } from './Server'
import { Config } from './Config'

type ReactUseState<T> = [T, React.Dispatch<React.SetStateAction<T>>]
const makeMakeTabBarItemProps = ([selected, setSelected]: ReactUseState<string>) => (key: string) => ({
  key,
  selected: selected === key,
  onPress: () => setSelected(key)
})

export const NavTabs: React.FC = () => {
  const selectedPair = useState('status')
  const ctx = useLanPlay()
  const makeTabBarItemProps = makeMakeTabBarItemProps(selectedPair)
  const { connected } = ctx

  return <>
    <TabBar>
      <TabBar.Item
        {...makeTabBarItemProps('status')}
        title='Status'
        icon={{uri: StatusIcon}}
        selectedIcon={{uri: StatusSelIcon}}
      >
        <Status/>
      </TabBar.Item>
      <TabBar.Item
        {...makeTabBarItemProps('server')}
        title='Server'
        icon={{uri: ServerIcon}}
        selectedIcon={{uri: ServerSelIcon}}
      >
        <Server/>
      </TabBar.Item>
      <TabBar.Item
        {...makeTabBarItemProps('config')}
        title='Config'
        icon={{uri: ConfigIcon}}
        selectedIcon={{uri: ConfigSelIcon}}
        badge={connected ? '' : '!'}
      >
        <Config/>
      </TabBar.Item>
    </TabBar>
  </>
}
