/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'source.unsplash.com',
      'images.pexels.com',
      'www.pexels.com',
      'img.freepik.com',
      'www.freepik.com',
      'cdn.pixabay.com',
      'pixabay.com',
      'res.cloudinary.com',
      'imagedelivery.net',
      'example.com',
      'picsum.photos',
      'loremflickr.com'
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig