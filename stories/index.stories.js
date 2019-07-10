import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Map } from '../bin/index';

storiesOf('Button', module)
  .add('with text', () => {
    const places = getPlaces()
    const marks = places.map((m, index) => {
      return <Marker
        key={m.id}
        icon={index === 0 ? activeIcon : inactiveIcon}
        title={'marker id: ' + m.id}
        position={{ lat: m.lat, lng: m.lng }}
        onClick={(latLng) => action(m.id + ".onClick " + lagLng.lat() + "," + latLng.lng())}
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
  });

loadGoogleMapsAPI({
  key: 'api-key'
})

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
