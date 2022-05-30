/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  images: {
    loader: 'akamai',
    path: '',
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
