import React, { PropsWithChildren, useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '@/src/layout/admin-layout/Sidebar';
import Header from '@/src/layout/admin-layout/Header';
import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from 'react-toastify';

export default function AdminLayout({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { data, signMessage } = useSignMessage();
  const [signature, setSignature] = useState<`0x${string}`>();
  const { showToast } = useToast();

  useEffect(() => {
    const authenticate = async () => {
      const storedSignature = localStorage.getItem('signature');

      if (storedSignature) {
        setSignature(storedSignature as `0x${string}`);
      } else if (signature) {
        try {
          console.log('here');
          const response = await axios.post('/api/auth/login', {
            address: address,
            signature: signature,
            userType: 'ORIGINATOR',
          });

          if (response.status === 200) {
            showToast('Authentication successful', { type: 'success' });
            localStorage.setItem('signature', signature);
            localStorage.setItem('address', address as string);
          } else {
            showToast('Authentication failed', { type: 'error' });
          }
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message) {
            showToast(`Authentication failed: ${error.response.data.message}`, { type: 'error' });
          } else {
            showToast('Authentication failed: An unexpected error occurred', { type: 'error' });
          }
        }
      }
    };
    authenticate();
  }, [signature, address]);

  useEffect(() => {
    if (isConnected && address && !signature && !localStorage.getItem('signature')) {
      const message = `Sign this message to authenticate with Phyken. Address: ${address}`;
      signMessage({ message });
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (data) {
      setSignature(data);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Metaquity Network</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="assets/login/metaquity-logo.png" />
      </Head>

      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="h-auto">
              <div className="mx-4 mt-5 p-4 md:p-6 2xl:p-10 bg-white h-full dark:bg-boxdark-2">{children}</div>
            </main>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
