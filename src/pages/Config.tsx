import './Config.less'
import React, { useCallback } from 'react'
import { useLanPlay } from 'slp'
import { List, InputItem } from 'antd-mobile'

export const Config: React.FC = () => {
  const ctx = useLanPlay()
  const { client } = ctx

  const handleUrl = useCallback((d: string) => { client!.transport.url = d }, [client])
  return <>
    <List renderHeader={'LanPlay Config'}>
      <InputItem onChange={handleUrl} defaultValue={client!.transport.url}>URL</InputItem>
    </List>
  </>
}
