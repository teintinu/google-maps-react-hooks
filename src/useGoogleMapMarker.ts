import { useEffect, useState } from 'react'
import { UntypedEvents } from './useGoogleMap'

export interface MarkMappedEvents {
  onClick (latlng: google.maps.LatLng): void,
  onDoubleClick (latlng: google.maps.LatLng): void,
}

const eventsMapping: {
  [eventname in keyof MarkMappedEvents]: [
    string,
    (marker: google.maps.Marker, args: any[]) => any[],
  ]
} = {
  onClick: ['click', (marker) => [marker]],
  onDoubleClick: ['dblclick', (marker) => [marker]]
}

export interface MarkOptions extends google.maps.ReadonlyMarkerOptions {
  untypedEvents?: UntypedEvents,
  events?: Partial<MarkMappedEvents>,
}

export default function useGoogleMapMarker (opts: MarkOptions & {
  api: typeof google.maps,
  map: google.maps.Map
}) {
  const { map, api, untypedEvents, events, ...options } = opts
  const [marker, setMarker] = useState<google.maps.Marker>()
  useEffect(() => {
    const marker = new google.maps.Marker(options)
    if (events) {
      Object.keys(events).forEach((eventName) => {
        const mapping: any = eventsMapping[eventName as keyof MarkMappedEvents]
        const handler: any = events[eventName as keyof MarkMappedEvents]
        map.addListener(mapping[0], (...args: any[]) => {
          const mappedArgs = mapping[1](marker, args)
          handler.apply(map, mappedArgs)
        })
      })
    }
    if (untypedEvents) {
      Object.entries(untypedEvents).forEach(([eventName, handler]) =>
        map.addListener(eventName, handler)
      )
    }
    setMarker(marker)
  }, [])

  useEffect(
    () => {
      marker && options.animation && marker.setAnimation(options.animation)
    },
    [options.animation]
  )
  useEffect(
    () => {
      marker && options.cursor && marker.setCursor(options.cursor)
    },
    [options.cursor]
  )
  useEffect(
    () => {
      marker && options.icon && marker.setIcon(options.icon)
    },
    [options.icon]
  )
  useEffect(
    () => {
      marker && options.label && marker.setLabel(options.label)
    },
    [options.label]
  )
  useEffect(
    () => {
      marker && options.opacity && marker.setOpacity(options.opacity)
    },
    [options.opacity]
  )
  useEffect(
    () => {
      marker && options.position && marker.setPosition(options.position)
    },
    [options.position]
  )
  useEffect(
    () => {
      marker && options.shape && marker.setShape(options.shape)
    },
    [options.shape]
  )
  useEffect(
    () => {
      marker && options.title && marker.setTitle(options.title)
    },
    [options.title]
  )
  useEffect(
    () => {
      marker && options.visible && marker.setVisible(options.visible)
    },
    [options.visible]
  )

  return marker
}
