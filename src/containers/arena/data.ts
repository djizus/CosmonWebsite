import { MEAType } from 'types/MEA'

const MEA_BASE_PATH = '/mea/'

export const getMEAs = (): MEAType[] => [
  {
    imgSrc: MEA_BASE_PATH + 'mea-commonwealth.png',
    link: 'https://commonwealth.im/kichain',
  },
  // {
  //   imgSrc: '/raffle/raffle-legendary-sold-out.png',
  //   link: 'https://app.teritori.com/collection/tori-tori1sz52w4uk2y5datsc3jj64p0s8ya5u93n43d39hx7s4633enscmzqvaw094/mint',
  //   linkInfo: 'https://docs.cosmon.ki/how-cosmon-works/weekly-raffles',
  // },
]
