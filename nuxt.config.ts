import path from 'path'
import { Configuration } from '@nuxt/types'
import dotenv from 'dotenv'
import pkg from './package.json'
import { PRIMARY_COLOR as primaryColor } from './utils/globalOptions'

const i18nCookieName = 'i18n_prefered'
const i18nFallbackLocale = 'en'

dotenv.config({
  path: path.join(
    __dirname,
    `config/${process.env.STAGE_ENV || 'development'}.env`
  )
})

const config: Configuration = {
  mode: 'universal',

  env: {
    AUTH_BASIC_PASSWORD: process.env.BASIC_AUTH_PASSWORD || '',
    AUTH_BASIC_USERNAME: process.env.BASIC_AUTH_USERNAME || '',
    USE_API_FALLBACK:
      process.env.NODE_ENV === 'development' ||
      process.env.STAGE_ENV === 'staging'
        ? 'TRUE'
        : 'FALSE'
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'cubePORTAL',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Noto+Sans+JP:300,400,500,700|Noto+Sans+KR:300,400,500,700|Noto+Sans+SC:300,400,500,700|Noto+Sans+TC:300,400,500,700&amp;subset=chinese-simplified,chinese-traditional,japanese,korean'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#00b45a', height: '5px' },

  /*
   ** Global CSS
   */
  css: ['@/node_modules/animate.css/animate.min.css', '@/assets/custom.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/polyfill',
    '@/plugins/anime.ts',
    '@/plugins/route.ts',
    '@/plugins/apis.ts',
    '@/plugins/i18n.ts',
    '@/plugins/validate.ts', // vee-validate 에서 i18n 과 apis 을 사용
    '@/plugins/logger',
    '@/plugins/auth.ts',
    { src: '@/plugins/charts.ts', ssr: false },
    '@/plugins/filters.ts',
    { src: '@/plugins/mask.ts', ssr: false },
    '@/plugins/notation.ts',
    { src: '@/plugins/downloader.ts', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    ['@nuxtjs/pwa', { icon: false }],
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/universal-storage',
    '@nuxtjs/toast',
    'nuxt-i18n',
    [
      'vue-sweetalert2/nuxt',
      {
        confirmButtonColor: primaryColor
      }
    ],
    '@nuxtjs/redirect-module',
    'vue-currency-input/nuxt'
  ],

  /**
   * Nuxt.js development modules
   */
  buildModules: ['@nuxtjs/vuetify', '@nuxt/typescript-build'],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL,
    debug: process.env.NODE_ENV === 'development',
    prefix: '/api/',
    proxy: true
  },

  proxy: {
    '/api/': { target: process.env.API_URL, pathRewrite: { '^/api/': '' } }
  },

  storage: {
    cookie: {
      prefix: 'portal'
    },
    localStorage: {
      prefix: 'portal'
    },
    ignoreExceptions: process.env.NODE_ENV !== 'development'
  },

  toast: {
    position: 'top-right',
    iconPack: 'callback',
    theme: 'outline',
    duration: 5000
  },

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en/index.js',
        label: 'English',
        dateFormat: 'MMMM DD, YYYY',
        dateTimeFormat: 'MMMM DD, YYYY, HH:mm:ss'
      },
      {
        code: 'ko',
        iso: 'ko-KR',
        file: 'ko/index.js',
        label: '한국어',
        dateFormat: 'YYYY년 MM월 DD일',
        dateTimeFormat: 'YYYY년 MM월 DD일 HH:mm:ss'
      },
      {
        code: 'ja',
        iso: 'ja-JP',
        file: 'ja/index.js',
        label: '日本語',
        dateFormat: 'YYYY年 MM月 DD日',
        dateTimeFormat: 'YYYY年 MM月 DD日 HH:mm:ss'
      },
      {
        code: 'zh',
        iso: 'zh-CN',
        file: 'zh/index.js',
        label: '中國語',
        dateFormat: 'YYYY年 MM月 DD日',
        dateTimeFormat: 'YYYY年 MM月 DD日 HH:mm:ss'
      }
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: {
      alwaysRedirect: true,
      cookieKey: i18nCookieName,
      fallbackLocale: i18nFallbackLocale,
      useCookie: true
    },
    lazy: true,
    langDir: 'locales/',
    vueI18n: {
      fallbackLocale: 'ko'
    },
    parsePages: false,
    seo: false
  },

  vuetify: {
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    optionsPath: '~/utils/vuetifyOptions.ts',
    /**
     * treeShake 가 true 이여야 customVariables 가 동작함.
     * 개발 생산성 저하될 경우 @nuxtjs/vuetify plugin 1.0.0-beta.0 이후 버젼 변경사항 확인 필요
     */
    treeShake: true
  },

  redirect: [
    {
      from: '^/account/(reset|signup)(.+)',
      to: (_, req) => {
        const { headers, url } = req
        const cookies = headers.cookie
          .split(/; */)
          .reduce((accumulator, item) => {
            const keyValueIndex = item.indexOf('=')
            accumulator[item.substr(0, keyValueIndex).trim()] = item
              .substr(keyValueIndex + 1)
              .trim()
            return accumulator
          }, {})

        const i18nPrefixValue = cookies[i18nCookieName]
        if (i18nPrefixValue && i18nPrefixValue !== i18nFallbackLocale) {
          return `/${i18nPrefixValue}${url}`
        }
        return `/en${url}`
      }
    }
  ],

  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true
  },

  pageTransition: {
    name: 'page',
    enterActiveClass: 'animated fadeIn fast',
    leaveActiveClass: 'animated fadeOut fast'
  },
  layoutTransition: {
    name: 'layout',
    enterActiveClass: 'animated fadeIn fast',
    leaveActiveClass: 'animated fadeOut fast'
  },

  /*
   ** Build configuration
   */
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    },

    transpile: ['vee-validate/dist/rules', 'vue-echarts', 'resize-detector'],

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (config && config.module && config.module.rules) {
        // Run ESLint on save
        if (ctx.isDev && ctx.isClient) {
          config.module.rules.push({
            enforce: 'pre',
            test: /\.(ts|js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules|vendors)/
          })
        }
      }
    }
  }
}

module.exports = config
