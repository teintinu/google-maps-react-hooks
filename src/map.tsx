import React from 'react'
import useGoogleMap, { MapOptions } from './useGoogleMap'

export interface GoogleMapChildElement {
  api: typeof google.maps,
  map: google.maps.Map,
}

export const Map: React.FunctionComponent<MapOptions> = (opts) => {
  const { children, ...options } = opts
  const { api, map, mapRef, loading } = useGoogleMap(options)

  return (
    <div className='map-container'>
      <div ref={mapRef} className='map-ref' />
      {!loading &&
        api ?
        React.Children.map(children, child => {
          return React.cloneElement(child as React.ReactElement, { map, api })
        }) : 'Error loading Google Maps API'}
    </div>
  )
}
