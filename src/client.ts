
const API_URL = 'https://maps.googleapis.com/maps/api/js'
const CALLBACK_NAME = '__googleMapsApiOnLoadCallback'

/**
 * Creates a Google Maps client. The client object contains all the API methods.
 */

export interface GoogleMapsApiOptions {
  /** API key (required, unless clientID and clientSecret provided). */
  key: string
  /** Maps API for Work client ID. */
  client?: string
  /** Maps API for Work channel. */
  channel?: string
  /** Default language for all queries. */
  language?: Language
  /**
   * The region code, specified as a ccTLD (country code top-level domain) two-character value.
   * Most ccTLD codes are identical to ISO 3166-1 codes, with some exceptions.
   * This parameter will only influence, not fully restrict, search results.
   * If more relevant results exist outside of the specified region, they may be included.
   * When this parameter is used, the country name is omitted from the resulting `formatted_address`
   * for results in the specified region.
   */
  region?: Language
  /** load additional Google Maps libraries */
  libraries?: Library[],
}

/**
 * You can load additional libraries by specifying a libraries parameter in the bootstrap request
 *
 * @see https://developers.google.com/maps/documentation/javascript/libraries
 */
export type Library = 'drawing' | 'geometry' | 'places' | 'visualization'

export interface RateOptions {
  /** Controls rate-limiting of requests. Maximum number of requests per period. (Default: 50). */
  limit?: number
  /** Period for rate limit, in milliseconds. (Default: 1000 ms). */
  period?: number
}

export interface RetryOptions {
  /** If a transient server error occurs, how long to wait before retrying the request, in milliseconds. (Default: 500 ms). */
  interval?: number
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
  'zh-TW'
)

let api: undefined | Promise<typeof google.maps>

export async function getGoogleMapsAPI () {
  if (!api) throw new Error('Please call loadGoogleMapsAPI on app initializaion')
  return api
}

export function loadGoogleMapsAPI (options: GoogleMapsApiOptions) {
  if (api) throw new Error('Please call loadGoogleMapsAPI just once')
  const wnd: any = window
  api = new Promise<typeof google.maps>(function (resolve, reject) {
    const tm = setTimeout(function () {
      wnd[CALLBACK_NAME] = () => 0
      reject(new Error('Could not load the Google Maps API'))
    }, 10000)

    wnd[CALLBACK_NAME] = function () {
      clearTimeout(tm)
      resolve(wnd.google.maps)
      delete wnd[CALLBACK_NAME]
    }

    const scriptElement = document.createElement('script')
    const params = [`callback=${CALLBACK_NAME}`]
    Object.entries(options).forEach(([optionName, optionValue]) => {
      if (options.libraries && optionName === 'libraries') params.push(`libraries=${options.libraries.join(',')}`)
      else params.push(optionName + '=' + optionValue)
    })

    scriptElement.src = API_URL + '?' + params.join('&')

    document.body.appendChild(scriptElement)
  })
  return api
}
