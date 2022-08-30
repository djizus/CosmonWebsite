import i18next, { InitOptions } from 'i18next'
import detector from 'i18next-browser-languagedetector'
import PhraseInContextEditorPostProcessor from 'i18next-phrase-in-context-editor-post-processor'
import {
  initReactI18next,
  Namespace,
  useTranslation as useTranslationNext,
  UseTranslationOptions,
} from 'react-i18next'

/* EN */
import enCommon from '@intl/en/common.json'
import enHome from '@intl/en/home.json'
import enArena from '@intl/en/arena.json'
import enArenas from '@intl/en/arenas.json'
import enFight from '@intl/en/fight.json'
/* FR */
import frCommon from '@intl/fr/common.json'
import frHome from '@intl/fr/home.json'
import frArena from '@intl/fr/arena.json'
import frArenas from '@intl/fr/arenas.json'
import frFight from '@intl/fr/fight.json'

const i18nextConfig: InitOptions = {
  defaultNS: 'common',
  detection: {
    order: [
      'path',
      'querystring',
      'cookie',
      'localStorage',
      'navigator',
      'htmlTag',
      'subdomain',
    ],
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  ns: ['common'],
  postProcess: ['phraseInContextEditor'],
  resources: {
    en: {
      common: enCommon,
      home: enHome,
      arena: enArena,
      arenas: enArenas,
      fight: enFight,
    },
    fr: {
      common: frCommon,
      home: frHome,
      arena: frArena,
      arenas: frArenas,
      fight: frFight,
    },
  },
  supportedLngs: ['en', 'fr'],
  lng: 'en',
}

i18next
  .use(detector)
  .use(initReactI18next)
  .use(
    new PhraseInContextEditorPostProcessor({
      phraseEnabled: process.env.REACT_APP_PHRASE_ENABLED === 'true',
      projectId: process.env.REACT_APP_PHRASE_PROJECT_ID as string,
    })
  )
  .init(i18nextConfig)

export const useTranslation = (
  namespace = i18nextConfig.defaultNS,
  options?: UseTranslationOptions
) => {
  return useTranslationNext(
    namespace as Namespace,
    {
      ...(options ?? {}),
    } as UseTranslationOptions
  )
}
