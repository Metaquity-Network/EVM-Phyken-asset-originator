/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'metaquity-upload.s3.ap-northeast-1.amazonaws.com'], // Add the hostname of the external source here
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_APP_PROJECT_ID: process.env.NEXT_APP_PROJECT_ID,
    EXPLORER_URL: process.env.EXPLORER_URL,
    NFT_CONTRACT_ADDRESS: process.env.NFT_CONTRACT_ADDRESS,
    IDENTITY_REGISTRY_CONTRACT_ADDRESS: process.env.IDENTITY_REGISTRY_CONTRACT_ADDRESS
  },
};

module.exports = nextConfig;
