'use client';
import { NextPage } from 'next';
import { AdminLayout } from '../layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../reducers/store';
import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data, signMessage } = useSignMessage();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState<`0x${string}`>();
  const [login, setLogin] = useState<boolean>(false);
  const [user, setUser] = useState<string>();

  useEffect(() => {
    const authenticate = async () => {
      if (signature) {
        try {
          const response = await axios.post('/api/auth/login', {
            address: address,
            signature: signature,
          });

          if (response.status !== 200) {
            setMessage('Authentication failed');
            toast.error('Authentication failed');
          } else {
            setLogin(true);
            setMessage(`Authenticated! JWT: ${response.data.token}`);
            toast.success('Authentication successful');
          }
        } catch (error: any) {
          console.error('Authentication error:', error);
          if (error.response && error.response.data && error.response.data.message) {
            setMessage(`Authentication failed: ${error.response.data.message}`);
            toast.error(`Authentication failed: ${error.response.data.message}`);
          } else {
            setMessage('Authentication failed: An unexpected error occurred');
            toast.error('Authentication failed: An unexpected error occurred');
          }
        }
      }
    };

    authenticate();
  }, [signature, address]);

  useEffect(() => {
    if (isConnected && !signature) {
      const message = `Sign this message to authenticate with Phyken. Address: ${address}`;
      signMessage({ message });
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (data) {
      setSignature(data);
    }
  }, [data]);

  useEffect(() => {
    getUserDetails().then((user) => {
      console.log(user);
      // setUser(user);
    });
  }, [login]);

  const User = () => {
    return <p>Welcome </p>;
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get('api/user/getUserDetails');
      if (res.status === 200) {
        const assetList = res.data;
        console.log(assetList);
        // setAssetPendingList(assetPendingList);
      } else {
        // setAssetUploadedList([]);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const walletNotConnected = () => (
    <div className="text-center">
      <h3 className="font-medium text-2xl text-black dark:text-white">
        Please connect your wallet to register new assets.
      </h3>
    </div>
  );

  const signSignature = () => (
    <div className="text-center">
      <h3 className="font-medium text-2xl text-black dark:text-white">Please sign with your wallet to onboard.</h3>
    </div>
  );

  return (
    <AdminLayout>
      {!isConnected ? (
        walletNotConnected()
      ) : !signature ? (
        signSignature()
      ) : (
        <>
          <div>
            <div className="grid grid-cols-1 w-full gap-2 md:gap-6 pb-8">
              <div className="2xsm:flex-row sm:flex items-center ">
                <div className="flex-grow pt-3">
                  <div className="text-zinc-900 2xsm:text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal">
                    <User />
                  </div>
                </div>
                <div className="pt-3">
                  <button
                    className="flex flex-row w-full h-10 py-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3"
                    onClick={() => router.push('upload-assets')}
                  >
                    <div>Finish KYC</div>
                  </button>
                </div>
                <div className="pt-3 pl-3">
                  <button
                    className="flex flex-row w-full h-10 py-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3"
                    onClick={() => router.push('create-did')}
                  >
                    <div>Create DID</div>
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5"></div>
            <div className="pt-10">
              <div className="rounded-sm p-4 dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5 w-[95%]">
                <div className="mb-7 items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-black dark:text-white">My Dashboard</h3>
                  </div>
                  <div className="pt-10">
                    <p>you haven't made any investment yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </AdminLayout>
  );
};

export default Home;
