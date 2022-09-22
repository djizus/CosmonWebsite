import { MEAType } from 'types/MEA'

const MEA_BASE_PATH = '/mea/'

export const getMEAs = (): MEAType[] => [
  {
    imgSrc: MEA_BASE_PATH + 'mea-whats-next.png',
    link: 'https://medium.com/ki-foundation/cosmon-whats-next-2154af7de5be',
  },
]
