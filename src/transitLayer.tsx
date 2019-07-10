import { useEffect, useState } from 'react'
import { GoogleMapChildElement } from './map'

export interface TansitLayerProps {
  enabled: boolean
}

export function TransitLayer (props: TansitLayerProps): React.ReactElement {
  const [transitLayer, setTransitLayer] = useState()
  const { api, map, enabled } = props as any as GoogleMapChildElement & TansitLayerProps
  useEffect(() => {
    setTransitLayer(new api.TransitLayer())
  }, [])

  useEffect(
    () => {
      if (transitLayer) {
        enabled ? transitLayer.setMap(map) : transitLayer.setMap(null)
      }
    },
    [enabled]
  )
  return null as any
}
