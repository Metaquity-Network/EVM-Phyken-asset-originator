import { useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';

export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      if (web3auth) {
        return;
      }

      try {
        const web3authInstance = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENTID!,
          web3AuthNetwork: 'sapphire_mainnet', // Web3Auth Network
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.OTHER,
            chainId: '0x1',
            rpcTarget: 'rpcUrl',
          },
        });
        setWeb3auth(web3authInstance);
        setProvider(web3authInstance.provider);
      } catch (error) {
        console.error('error', error);
      }
    };
    init();
  }, [web3auth]);

  return { web3auth, provider };
};
