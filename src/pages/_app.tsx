import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../reducers/store';
import Head from 'next/head';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base, polygonMumbai, berachainTestnet, celoAlfajores, xdcTestnet } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import useColorMode from '../hooks/useColorMode';

const config = getDefaultConfig({
  appName: 'Phyken Investor',
  projectId: 'YOUR_PROJECT_ID',
  chains: [base, polygonMumbai, berachainTestnet, celoAlfajores, xdcTestnet],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title> Metaquity network: Investor </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="assets/login/metaquity-logo.png" />
      </Head>
      <Provider store={store}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider>
              <Component {...pageProps} />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </Provider>
    </>
  );
}

export default MyApp;
