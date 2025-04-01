/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'www.dekkjahollin.is',
      'dekkjahollin.is',
      'bud.klettur.is',
      'klettur.is',
      'www.klettur.is',
      'mitra.is',
      'www.mitra.is',
      'nesdekk.is',
      'www.nesdekk.is',
      'dekkjasalan.is',
      'www.dekkjasalan.is',
      // Add any additional domains used for image URLs here
    ],
  },
}

module.exports = nextConfig
