# google-maps-react-hooks
Google Maps React Hooks


# install

```npm install google-maps-react-hooks```

# demo

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/twilight-worker-qet1i?fontsize=14)

```typescript
import * as React from 'react'
import {Map, Marker, TransitLayer, loadGoogleMapsAPI} from 'google-maps-react-hooks'

export function app() {
  const places = getPlaces()
  const marks = places.map((m, index) => {
    return <Marker
      key={m.id}
      icon={index === 0 ? activeIcon : inactiveIcon}
      title={'marker id: ' + m.id}
      position={{ lat: m.lat, lng: m.lng }}      
    />
  })
  places.map((m, index) => {
    return <Marker
      key={m.id}
      icon={index === 0 ? activeIcon : inactiveIcon}
      title={'marker id: ' + m.id}
      position={{ lat: m.lat, lng: m.lng }}
    />
  })
  return <Map zoom={10}
    center={{ lat: places[0].lat, lng: places[0].lng }}
  >
    {marks}
    < TransitLayer enabled={true} />
  </Map >
}

function getPlaces() {
  const cnt = 10
  const markers = []
  const base = { lat: 35.6432027, lng: 139.6729435 }
  for (let i = 0; i < cnt; i++) {
    markers.push({
      id: i,
      title: 'marker: ' + i,
      lat: base.lat + 0.04 * i,
      lng: base.lng + 0.04 * i
    })
  }
  return markers
}

const activeIcon =
  'https://a0.muscache.com/airbnb/static/select_pdp/home_icon-9999d1852c239e9a93c7d7975441c254.png'
const inactiveIcon =
  'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png'

loadGoogleMapsAPI({
  key: 'api-key'
})

```