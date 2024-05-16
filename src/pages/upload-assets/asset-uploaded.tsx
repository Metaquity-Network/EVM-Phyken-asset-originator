'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { AdminLayout } from '@/src/layout';
const assetUploaded: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <AdminLayout>
        <div className="flex justify-center">
          <div className="relative w-full lg:w-[70%] 2xsm:w-[100%] rounded-l py-12 px-8 text-center md:py-15 md:px-17.5">
            <span className="mx-auto inline-block text-5xl text-primary">
              <FaCheckCircle />
            </span>
            <h3 className="mt-5.5 pb-2 text-xl font-bold sm:text-4xl">Asset Uploaded Successfully!</h3>
            <p className="pt-5">Please allow us a while to verify the asset and the associated licenses. </p>
            <p className="mb-7.5"> We will notify you once the asset has been verified successfully, </p>
            <p className="pt-8">Post verification, login and follow the steps to complete the asset onboarding.</p>
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

export default assetUploaded;
