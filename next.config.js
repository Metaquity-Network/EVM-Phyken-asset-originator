/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'metaquity-upload.s3.ap-northeast-1.amazonaws.com'], // Add the hostname of the external source here
  },
  env: {
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_REGION_ACCESS_KEY: process.env.AWS_S3_REGION_ACCESS_KEY,
    AWS_S3_REGION_SECRET_ACCESS_KEY: process.env.AWS_S3_REGION_SECRET_ACCESS_KEY,
    VERSION: process.env.VERSION,
    BASE_URL: process.env.BASE_URL,
    POLKADOT_RPC_URL: process.env.POLKADOT_RPC_URL,
    NEXT_PUBLIC_WEB3_AUTH_CLIENTID: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENTID,
    KILT_WSS_ADDRESS: process.env.KILT_WSS_ADDRESS,
    KILT_PAYMENT_ACCOUNT_MNEMONIC: process.env.KILT_PAYMENT_ACCOUNT_MNEMONIC
  },
};

module.exports = nextConfig;
