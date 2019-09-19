import React from 'react'
import { LanPlayContextValue } from 'slp'
import { List, InputItem } from 'antd-mobile'
import './Config.less'

export const Config: React.FC<{ ctx: LanPlayContextValue }> = ({ ctx: { connected, client } }) => <>
  <List renderHeader={'LanPlay Config'}>
    <InputItem defaultValue={client!.transport.url}>URL</InputItem>
  </List>
</>
