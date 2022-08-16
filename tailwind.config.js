module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins'],
      },
      colors: {
        cosmon: {
          blue: {
            dark: '#0A0733',
            darker: '#08062B',
          },
          black: {
            10: '#191A20',
            9: '#21232C',
            8: '#444444',
            6: '#696969',
            4: '#8E8E8E',
            2: '#B2B2B2',
          },
          gray: {
            10: '#F2F2F2',
            9: '#E5E5E5',
            8: '#CCCCCC',
            7: '#B2B2B2',
            6: '#999999',
            5: '#808080',
            4: '#666666',
            3: '#4D4D4D',
            2: '#333333',
            1: '#1A1A1A',
          },
          main: {
            primary: '#413673',
            secondary: '#20164F',
            tertiary: '#9FA4DD',
            quaternary: '#39365A',
            quinary: '#222047',
            // gradient:
            //   'linear-gradient(180deg, #a996ff 0%,rgba(118, 96, 216, 0.5) 100%)',
          },
          premium: {
            primary: '#89969E',
            secondary: '#4C606C',
            // gradient:
            //   'linear-gradient(51.24deg, #89969E 15.25%, #4C606C 84.15%)',
          },
          contextual: {
            danger: '#DF4547',
          },
        },
      },
    },
  },
  plugins: [
    // function ({ addUtilities }) {
    //   addUtilities({
    //     'main-gradient': {
    //       background:
    //         'linear-gradient(180deg, #a996ff 0%,rgba(118, 96, 216, 0.5) 100%)',
    //     },
    //     'premium-gradient': {
    //       background:
    //         'linear-gradient(51.24deg, #89969E 15.25%, #4C606C 84.15%)',
    //     },
    //   })
    // },
  ],
}
