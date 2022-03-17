/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    loader: 'imgix',
    path: 'https://cosmon.ki/',
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}
