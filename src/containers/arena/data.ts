import { MEAType } from 'types/MEA'

const MEA_BASE_PATH = '/mea/'

export const getMEAs = (): MEAType[] => [
  {
    imgSrc: MEA_BASE_PATH + 'mea-whats-next.png',
    title: 'Cosmon: What’s next?',
    link: 'https://medium.com/ki-foundation/cosmon-whats-next-2154af7de5be',
    subtitle: 'Gameplay & rewards',
  },
  {
    imgSrc: MEA_BASE_PATH + 'mea-stakedrop.png',
    title: 'Cosmon Stakedrop',
    link: 'https://medium.com/ki-foundation/cosmon-stakedrop-da5120d5b879',
    subtitle: 'Community’s Stakedrop',
  },
  {
    imgSrc: MEA_BASE_PATH + 'mea-leaders.png',
    title: 'Cosmon Leaders',
    link: 'https://medium.com/ki-foundation/an-unidentified-threat-is-approaching-and-wosmongton-knows-there-is-very-little-if-any-time-left-8f532d614a8a',
    subtitle: 'Rarity traits and evolution system',
  },
]
