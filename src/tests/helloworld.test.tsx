import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { Map } from '../map'
import { TransitLayer } from '../transitLayer'
import { Marker } from '../marker'
import { loadGoogleMapsAPI } from '../client'
import { act } from 'react-dom/test-utils'

// tslint:disable-next-line: no-floating-promises
loadGoogleMapsAPI({
  key: 'api-key'
})

describe('Hello Map', () => {
  it('renders', async () => {
    const places = getPlaces()
    const marks = places.map((m, index) => {
      return <Marker
        key={m.id}
        icon={index === 0 ? activeIcon : inactiveIcon}
        title={'marker id: ' + m.id}
        position={{ lat: m.lat, lng: m.lng }}
      />
    })
    let mounted: ShallowWrapper<any, any, any> = undefined as any
    act(() => {
      mounted = shallow(<div>
        Google Map Test
      <Map
          zoom={10}
          center={{ lat: places[0].lat, lng: places[0].lng }}
        >
          {marks}
          <TransitLayer enabled={true} />
        </Map>
      </div>)
    })

    expect(mounted).toBeDefined()
    expect(mounted).toMatchSnapshot()
    // expect(mounted.find('.map-container').length).toBe(1)
    // expect(mounted.find('.map-ref').length).toBe(1)

    await new Promise(r => setTimeout(r, 3000))

    act(() => {
      mounted.update()
    })

    expect(mounted).toMatchSnapshot()
  })
})

export default function getPlaces () {
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
