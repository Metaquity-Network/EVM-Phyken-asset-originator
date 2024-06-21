import { http, createConfig } from 'wagmi';
import { celoAlfajores } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = '3fbb6bba6f1de962d911bb5b5c9dba88';

export const config = createConfig({
  chains: [celoAlfajores],
  connectors: [injected(), walletConnect({ projectId })],
  transports: {
    [celoAlfajores.id]: http(),
  },
});
