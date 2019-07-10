import React from 'react'
import useGoogleMapMarker, { MarkOptions } from './useGoogleMapMarker'

export const Marker: React.FunctionComponent<MarkOptions> = (opts) => {
  useGoogleMapMarker(opts as any)
  return null
}
