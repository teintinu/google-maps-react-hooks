/// <reference types="googlemaps" />
/// <reference types="react" />
declare module "client" {
    /**
     * Creates a Google Maps client. The client object contains all the API methods.
     */
    export interface GoogleMapsApiOptions {
        /** API key (required, unless clientID and clientSecret provided). */
        key: string;
        /** Maps API for Work client ID. */
        client?: string;
        /** Maps API for Work channel. */
        channel?: string;
        /** Default language for all queries. */
        language?: Language;
        /**
         * The region code, specified as a ccTLD (country code top-level domain) two-character value.
         * Most ccTLD codes are identical to ISO 3166-1 codes, with some exceptions.
         * This parameter will only influence, not fully restrict, search results.
         * If more relevant results exist outside of the specified region, they may be included.
         * When this parameter is used, the country name is omitted from the resulting `formatted_address`
         * for results in the specified region.
         */
        region?: Language;
        /** load additional Google Maps libraries */
        libraries?: Library[];
    }
    /**
     * You can load additional libraries by specifying a libraries parameter in the bootstrap request
     *
     * @see https://developers.google.com/maps/documentation/javascript/libraries
     */
    export type Library = 'drawing' | 'geometry' | 'places' | 'visualization';
    export interface RateOptions {
        /** Controls rate-limiting of requests. Maximum number of requests per period. (Default: 50). */
        limit?: number;
        /** Period for rate limit, in milliseconds. (Default: 1000 ms). */
        period?: number;
    }
    export interface RetryOptions {
        /** If a transient server error occurs, how long to wait before retrying the request, in milliseconds. (Default: 500 ms). */
        interval?: number;
    }
    /**
     * By default the API will attempt to load the most appropriate language based on the users location or browser settings.
     * Some APIs allow you to explicitly set a language when you make a request
     *
     * @see https://developers.google.com/maps/faq#languagesupport
     */
    export type Language = (
    /** Arabic */
    'ar' | 
    /** Belarusian */
    'be' | 
    /** Bulgarian */
    'bg' | 
    /** Bengali */
    'bn' | 
    /** Catalan */
    'ca' | 
    /** Czech */
    'cs' | 
    /** Danish */
    'da' | 
    /** German */
    'de' | 
    /** Greek */
    'el' | 
    /** English */
    'en' | 
    /** English (Australian) */
    'en-Au' | 
    /** English (Great Britain) */
    'en-GB' | 
    /** Spanish */
    'es' | 
    /** Basque */
    'eu' | 
    /** Farsi */
    'fa' | 
    /** Finnish */
    'fi' | 
    /** Filipino */
    'fil' | 
    /** French */
    'fr' | 
    /** Galician */
    'gl' | 
    /** Gujarati */
    'gu' | 
    /** Hindi */
    'hi' | 
    /** Croatian */
    'hr' | 
    /** Hungarian */
    'hu' | 
    /** Indonesian */
    'id' | 
    /** Italian */
    'it' | 
    /** Hebrew */
    'iw' | 
    /** Japanese */
    'ja' | 
    /** Kazakh */
    'kk' | 
    /** Kannada */
    'kn' | 
    /** Korean */
    'ko' | 
    /** Kyrgyz */
    'ky' | 
    /** Lithuanian */
    'lt' | 
    /** Latvian */
    'lv' | 
    /** Macedonian */
    'mk' | 
    /** Malayalam */
    'ml' | 
    /** Marathi */
    'mr' | 
    /** Burmese */
    'my' | 
    /** Dutch */
    'nl' | 
    /** Norwegian */
    'no' | 
    /** Punjabi */
    'pa' | 
    /** Polish */
    'pl' | 
    /** Portuguese */
    'pt' | 
    /** Portuguese (Brazil) */
    'pt-BR' | 
    /** Portuguese (Portugal) */
    'pt-PT' | 
    /** Romanian */
    'ro' | 
    /** Russian */
    'ru' | 
    /** Slovak */
    'sk' | 
    /** Slovenian */
    'sl' | 
    /** Albanian */
    'sq' | 
    /** Serbian */
    'sr' | 
    /** Swedish */
    'sv' | 
    /** Tamil */
    'ta' | 
    /** Telugu */
    'te' | 
    /** Thai */
    'th' | 
    /** Tagalog */
    'tl' | 
    /** Turkish */
    'tr' | 
    /** Ukrainian */
    'uk' | 
    /** Uzbek */
    'uz' | 
    /** Vietnamese */
    'vi' | 
    /** Chinese (Simlified) */
    'zh-CN' | 
    /** Chinese (Traditional) */
    'zh-TW');
    export function getGoogleMapsAPI(): Promise<typeof google.maps>;
    export function loadGoogleMapsAPI(options: GoogleMapsApiOptions): Promise<typeof google.maps>;
}
declare module "useGoogleMap" {
    export interface UntypedEvents {
        [eventname: string]: (...args: any[]) => void;
    }
    export interface MapMappedEvents {
        onCenterChanged(center: google.maps.LatLng): void;
        onBoundsChanged(bounds: google.maps.LatLngBounds): void;
        onZoomChanged(zoom: number): void;
        onTiltChanged(tilt: number): void;
        onTalesLoaded(): void;
        onClick(latlng: google.maps.LatLng): void;
    }
    export interface MapOptions extends google.maps.MapOptions {
        untypedEvents?: UntypedEvents;
        events?: Partial<MapMappedEvents>;
    }
    export default function useGoogleMap(options: MapOptions): {
        api: typeof google.maps;
        map: google.maps.Map;
        loading: boolean;
        mapRef: import("react").MutableRefObject<null>;
    };
}
declare module "useGoogleMapMarker" {
    import { UntypedEvents } from "useGoogleMap";
    export interface MarkMappedEvents {
        onClick(latlng: google.maps.LatLng): void;
        onDoubleClick(latlng: google.maps.LatLng): void;
    }
    export interface MarkOptions extends google.maps.ReadonlyMarkerOptions {
        untypedEvents?: UntypedEvents;
        events?: Partial<MarkMappedEvents>;
    }
    export default function useGoogleMapMarker(opts: MarkOptions & {
        api: typeof google.maps;
        map: google.maps.Map;
    }): google.maps.Marker | undefined;
}
declare module "map" {
    import React from 'react';
    import { MapOptions } from "useGoogleMap";
    export interface GoogleMapChildElement {
        api: typeof google.maps;
        map: google.maps.Map;
    }
    export const Map: React.FunctionComponent<MapOptions>;
}
declare module "marker" {
    import React from 'react';
    import { MarkOptions } from "useGoogleMapMarker";
    export const Marker: React.FunctionComponent<MarkOptions>;
}
declare module "transitLayer" {
    export interface TansitLayerProps {
        enabled: boolean;
    }
    export function TransitLayer(props: TansitLayerProps): React.ReactElement;
}
declare module "index" {
    import "tslib";
    export * from "client";
    export * from "useGoogleMap";
    export * from "useGoogleMapMarker";
    export * from "map";
    export * from "marker";
    export * from "transitLayer";
}
