'use client';
import { NextPage } from 'next';
import { AdminLayout } from '../layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { useAppSelector } from '../reducers/store';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const router = useRouter();
  const userDetails = useAppSelector((state) => state.userDetails.value);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    getUserDetails();
    console.log(address);
    console.log(isConnected);
  }, []);

  const User = () => {
    if (userDetails) {
      return <p>Welcome Back! </p>;
    }
    return null;
  };

  const getUserDetails = async () => {
    const res = await axios.get('api/user/getUserDetails');
    if (res.status === 200) {
      const assetList = res.data;
      console.log(assetList);
      // setAssetPendingList(assetPendingList);
    } else {
      // setAssetUploadedList([]);
    }
  };

  const walletNotConnected = () => {
    return <p>Welcome Back! </p>;
  };

  return (
    <AdminLayout>
      {isConnected ? (
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
      ) : (
        walletNotConnected()
      )}
    </AdminLayout>
  );
};
export default Home;
