'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/src/layout';
import TokenPrice from '@/src/components/charts/token-price';
import Breadcrumb from '@/src/components/Breadcrumbs/Breadcrumb';

const Wallet: React.FC = () => {
  const router = useRouter();
  const [balance, setBalance] = useState<any>(null);
  const [accounttHistory, setAccounttHistory] = useState<any[]>();

  return (
    <>
      <AdminLayout>
        <Breadcrumb pageName={['Wallet']} />
        <div className="grid grid-cols-1 w-full gap-2 md:gap-6 pb-8">
          <div className="2xsm:flex-row sm:flex items-end md:justify-end">
            <div className="pt-3 flex md:justify-end 2xsm:flex-col 2xsm:pt-3 sm:flex-row">
              <div className="p-2">
                <button
                  className="flex flex-row w-45 h-10 py-2 justify-center rounded-full border border-primary text-primary hover:bg-opacity-90 p-3 font-medium gap-3 hover:bg-primary hover:text-white dark:text-gray-3 dark:border-gray-3 dark:hover:bg-primary"
                  onClick={() => router.push('upload-assets')}
                >
                  <div>Buy MQTY Tokens</div>
                </button>
              </div>
              <div className="p-2">
                <button
                  className="flex flex-row w-45 h-10 py-2 justify-center rounded-full border border-primary text-primary hover:bg-opacity-90 p-3 font-medium gap-3 hover:bg-primary hover:text-white dark:text-gray-3 dark:border-gray-3 dark:hover:bg-primary"
                  onClick={() => router.push('upload-assets')}
                >
                  <div>Sell MQTY Tokens</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-7">
            <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
              <div className="col-span-12 md:col-span-6">
                <div className="rounded-sm border border-stroke bg-ghostwhite-100 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex flex-row items-center justify-between p-3 xl:p-8">
                    <div className="font-semibold text-lg">ABI Tokens</div>
                    <div className=" text-zinc-900 text-3xl font-normal font-['Inter'] leading-10">
                      <div>
                        <span>{balance ? balance : null}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="rounded-sm border border-stroke bg-ghostwhite-100 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex flex-row items-center justify-between p-3 xl:p-8">
                    <div className="font-semibold text-lg">Price of MQTY Tokens</div>
                    <div className=" text-zinc-900 text-lg font-normal font-['Inter'] leading-10">$4</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <TokenPrice />
            </div>
          </div>
          <div className="col-span-12 xl:col-span-5">
            <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
              <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">History</h4>

              <div>
                {accounttHistory?.map((account, key) => (
                  <>
                    <div className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4" key={key}>
                      <div className="relative h-14 w-14 rounded-full">{account.block}</div>

                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <h5 className="font-medium text-black dark:text-white">From: {account.from?.hash} </h5>
                          <p>
                            <span className="text-xs"> To: {account.to?.hash} </span>
                          </p>
                        </div>
                        {/* <div className="flex h-6 w-6 flex-col items-center justify-center">
                        <span className="text-lg font-bold text-white"> $75.65</span>
                      </div> */}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default Wallet;
