'use client';

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AdminLayout } from '@/src/layout';
const AssetVerification: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <AdminLayout>
        <div className="flex justify-center">
          <div className="relative w-full lg:w-[70%] 2xsm:w-[100%] rounded-l py-12 px-8 text-center md:py-15 md:px-17.5">
            <span className="mx-auto inline-block text-5xl text-primary">
              <FaCheckCircle />
            </span>
            <h3 className="mt-5.5 pb-2 text-xl font-bold sm:text-4xl">Asset Verification Complete!</h3>
            <p className="pt-5 pb-5">Your asset has been verified successfully, and an NFT has been created. </p>
            <div className="grid grid-cols-1 md:grid-cols-4 px-10 pt-10 bg-bodydark1 dark:bg-boxdark">
              <div className="w-full h-64 2xsm:pt-4 md:pt-0 md:col-span-3">
                <Image className="h-[85%]" width={350} height={350} src={'/assets/asset-verified.png'} alt="Cards" />
              </div>
              <div className="w-1/2 flex flex-col 2xsm:w-full">
                <button className="flex flex-row w--50% h-10 py-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3">
                  <div>View NFT</div>
                </button>
                <p className="p-3">Created By XYZ</p>
              </div>
            </div>
            <div className="flex justify-center pt-15 ">
              <button
                className="flex flex-row md:w-[50%] 2xsm:w-[100%] h-10 py-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3"
                onClick={() => router.push('/')}
              >
                <div>Return To Home</div>
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AssetVerification;
