import React, { useState } from 'react'
import { TabBar, Button } from 'antd-mobile'
import StatusIcon from 'images/status.png'
import StatusSelIcon from 'images/status_selected.png'
import ServerIcon from 'images/server.png'
import ServerSelIcon from 'images/server_selected.png'
import ConfigIcon from 'images/configure.png'
import ConfigSelIcon from 'images/configure_selected.png'
import { LanPlayComponent } from 'slp'
import { Config } from './Config'

type ReactUseState<T> = [T, React.Dispatch<React.SetStateAction<T>>]
const makeMakeTabBarItemProps = ([selected, setSelected]: ReactUseState<string>) => (key: string) => ({
  key,
  selected: selected === key,
  onPress: () => setSelected(key)
})

export const NavTabs: React.FC = () => {
  const selectedPair = useState('status')
  const makeTabBarItemProps = makeMakeTabBarItemProps(selectedPair)
  return <>
    <LanPlayComponent>
      {(ctx) => {
        const { connected } = ctx
        return <TabBar>
        <TabBar.Item
          {...makeTabBarItemProps('status')}
          title='Status'
          icon={{uri: StatusIcon}}
          selectedIcon={{uri: StatusSelIcon}}
        >
          <Button type='primary'>hello world1</Button>
          <div>{JSON.stringify(ctx)}</div>
        </TabBar.Item>
        <TabBar.Item
          {...makeTabBarItemProps('server')}
          title='Server'
          icon={{uri: ServerIcon}}
          selectedIcon={{uri: ServerSelIcon}}
        >
          <Button type='primary'>hello world2</Button>
        </TabBar.Item>
        <TabBar.Item
          {...makeTabBarItemProps('config')}
          title='Config'
          icon={{uri: ConfigIcon}}
          selectedIcon={{uri: ConfigSelIcon}}
          badge={connected ? '' : '!'}
        >
          <Config ctx={ctx}/>
        </TabBar.Item>
      </TabBar>
      }}
    </LanPlayComponent>
  </>
}
