'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaCheckCircle } from 'react-icons/fa';
import { AdminLayout } from '@/src/layout';
import axios from 'axios';

const assetUploaded: React.FC = () => {
  const router = useRouter();
  const [assetDetails, setAssetDetails] = useState<any>();

  useEffect(() => {
    getAssetById();
  }, []);

  const getAssetById = async () => {
    const res = await axios.get(`/api/assets/getAssetById`, { params: { id: router.query.assetId } });
    if (res.status === 200) {
      const asset = res.data;
      setAssetDetails(asset);
    }
  };

  return (
    <>
      <AdminLayout>
        <div className="flex justify-center">
          <div className="relative w-full 2xsm:max-w-[100%] md:w-[50%] rounded-l py-12 px-8 text-center md:py-15 md:px-17.5">
            <span className="mx-auto inline-block text-5xl text-primary">
              <FaCheckCircle />
            </span>
            <h3 className="mt-5.5 pb-2 text-xl font-bold sm:text-4xl">Token Created Successfully!</h3>
            <div className="grid md:justify-center md:grid-flow-col 2xsm:grid-flow-row pt-15 gap-6">
              <div className="rounded-sm border bg-gray-2 border-stroke bg-ghostwhite-100 p-3 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex flex-col items-start justify-between 2xsm:p-2 ">
                  <div className="w-40 font-semibold text-lg">Number of Token:</div>
                  <div className=" text-7xl pt-7 leading-10 py-2">
                    {assetDetails?.nftFractionalizationDetails.fractionalization}
                  </div>
                </div>
              </div>
              <div className="rounded-sm border bg-gray-2 border-stroke bg-ghostwhite-100 p-3 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex flex-col items-start justify-between 2xsm:p-2 ">
                  <div className="w-40 font-semibold text-lg">Price Per Token:</div>
                  <div className=" text-7xl pt-7 leading-10 py-2">
                    ${assetDetails?.nftFractionalizationDetails.fractionalizationPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:grid md:grid-cols-2 2xsm:grid-flow-row">
          <div className="grid col-end-4 md:grid-flow-col 2xsm:grid-flow-row pt-10 gap-4">
            {/* <button
              className="inline-flex items-center justify-center rounded-full border border-primary py-4 px-10 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
              onClick={() => router.push('/')}
            >
              <div>Download Summary</div>
            </button> */}
            <button
              className="inline-flex items-center justify-center rounded-full border border-primary py-4 px-10 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
              onClick={() => router.push('/assets')}
            >
              <div>View My Assets</div>
            </button>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default assetUploaded;
