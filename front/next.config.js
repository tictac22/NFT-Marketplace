/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: "false",
})
//withBundleAnalyzer()
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.moralis.io'],
  },
  typescript : {
    ignoreBuildErrors: true
  }
}

