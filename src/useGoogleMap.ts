
import { useEffect, useState, useRef } from 'react'
import { getGoogleMapsAPI } from './client'

export interface UntypedEvents {
  [eventname: string]: (...args: any[]) => void
}

export interface MapMappedEvents {
  onCenterChanged (center: google.maps.LatLng): void,
  onBoundsChanged (bounds: google.maps.LatLngBounds): void,
  onZoomChanged (zoom: number): void,
  onTiltChanged (tilt: number): void,
  onTalesLoaded (): void,
  onClick (latlng: google.maps.LatLng): void,
}

const eventsMapping: {
  [eventname in keyof MapMappedEvents]: [
    string,
    (map: google.maps.Map, args: any[]) => any[],
  ]
} = {
  onCenterChanged: ['center_changed', (map) => [map.getCenter()]],
  onBoundsChanged: ['bounds_changed', (map) => [map.getBounds()]],
  onZoomChanged: ['zoom_changed', (map) => [map.getZoom()]],
  onTiltChanged: ['tilt_changed', (map) => [map.getTilt()]],
  onTalesLoaded: ['tilesloaded', (map) => []],
  onClick: ['click', (map, args) => [args[0].latLng]]
  // TODO: https://developers.google.com/maps/documentation/javascript/events
}

export interface MapOptions extends google.maps.MapOptions {
  untypedEvents?: UntypedEvents,
  events?: Partial<MapMappedEvents>,
}

export default function useGoogleMap (options: MapOptions) {
  const [mapState, setMapState] = useState<{
    api: typeof google.maps,
    map: google.maps.Map,
    loading: boolean
  }>({ loading: true, api: null as any, map: null as any })
  const { center } = options
  const mapRef = useRef(null)
  useEffect(() => {
    // tslint:disable-next-line: no-floating-promises
    getGoogleMapsAPI().then(api => {
      const { untypedEvents, events } = options
      delete options.untypedEvents
      delete options.events
      const map = new google.maps.Map(mapRef.current, options)
      if (events) {
        Object.keys(events).forEach((eventName) => {
          const mapping: any = eventsMapping[eventName as keyof MapMappedEvents]
          const handler: any = events[eventName as keyof MapMappedEvents]
          map.addListener(mapping[0], (...args: any[]) => {
            const mappedArgs = mapping[1](map, args)
            handler.apply(map, mappedArgs)
          })
        })
      }
      if (untypedEvents) {
        Object.entries(untypedEvents).forEach(([eventName, handler]) =>
          map.addListener(eventName, handler)
        )
      }
      setMapState({ api, map, loading: false })
    })
  }, [])
  useEffect(
    () => {
      mapState.map && center && mapState.map.panTo(center)
    },
    [center && center.lat, center && center.lng]
  )
  return { mapRef, ...mapState }
}
