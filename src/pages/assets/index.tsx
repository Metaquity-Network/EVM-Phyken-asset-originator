'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AssetList } from '@/src/types/asset';
import Link from 'next/link';
import { AdminLayout } from '@/src/layout';
import { useToast } from '@/src/hooks/useToast';
import { useAppSelector } from '@/src/reducers/store';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../../public/contract/contract-abi';
import { getTransactionConfirmations } from '@wagmi/core';
import { config } from '@/src/config/wagmiConfig';
import AssetTable from '@/src/components/tables/AssetTable';
import Spinner from '@/src/components/spinner/spinner';

const Assets: React.FC = () => {
  const router = useRouter();
  const [openTab, setOpenTab] = useState(1);
  const { showToast } = useToast();
  const [assetUploadedList, setAssetUploadedList] = useState<AssetList[]>([]);
  const [assetPendingList, setAssetPendingList] = useState<AssetList[]>([]);
  const userDetails = useAppSelector((state) => state.userDetails.value);
  const [mintingAssets, setMintingAssets] = useState<Record<string, boolean>>({});
  const [confirmedAssets, setConfirmedAssets] = useState<Record<string, boolean>>({});
  const [allAssetList, setAllAssetList] = useState<AssetList[]>([]);
  const [isClient, setIsClient] = useState(false);
  const activeClasses = 'bg-primary text-white hover:opacity-100';
  const inactiveClasses = 'bg-gray dark:bg-meta-4 text-black dark:text-white';
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract({
    config: config,
  });
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as `0x${string}`;

  useEffect(() => {
    getAssetList();
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (hash && isConfirmed) {
      console.log('isConfirmed', isConfirmed);
      const assetId = Object.keys(mintingAssets).find((id) => mintingAssets[id] === true);
      if (assetId) {
        setConfirmedAssets((prev) => ({ ...prev, [assetId]: true }));
        setMintingAssets((prev) => ({ ...prev, [assetId]: false }));
      }
    }
  }, [hash, isConfirmed]);

  const getAssetList = async () => {
    const res = await axios.get('/api/assets/getAssets');
    if (res.status === 200) {
      const assetList = res.data;
      setAllAssetList(assetList);
      const assetUploadedList = assetList.filter((asset: { assetStatus: string }) =>
        ['ACTIVE'].includes(asset.assetStatus),
      );
      setAssetUploadedList(assetUploadedList);
      const assetPendingList = assetList.filter((asset: { assetStatus: string }) =>
        ['PENDING'].includes(asset.assetStatus),
      );
      setAssetPendingList(assetPendingList);
    } else {
      setAssetUploadedList([]);
    }
  };

  const convertToCustomFormat = (uuid: string) => {
    const parts = uuid.split('-');
    const shortenedUUID = parts[0].slice(0, 4) + '...' + parts[4].slice(-4);
    return shortenedUUID;
  };

  const mintAsset = async (asset: AssetList) => {
    try {
      setMintingAssets((prev) => ({ ...prev, [asset.id]: true }));
      await writeContract({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: 'mint',
        args: [address as `0x${string}`],
      });
    } catch (error) {
      console.log(error);
      setMintingAssets((prev) => ({ ...prev, [asset.id]: false }));
    }
  };

  const viewTx = (hash: string) => {
    const url = `${process.env.EXPLORER_URL}${hash}`;
    window.open(url, '_blank');
  };

  if (!isClient) {
    return (
      <AdminLayout>
        <div className="rounded-sm p-4 dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5 w-[95%]">
          <div className="mb-7 flex flex-row items-start justify-between">
            <h3 className="text-2xl font-semibold text-black dark:text-white">All Assets</h3>
          </div>
          <p>Loading....</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout>
        <div className="rounded-sm p-4 dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5 w-[95%]">
          <div className="mb-7 flex flex-row items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-black dark:text-white">All Assets</h3>
            </div>
            <button
              className="flex-wrap mr-5 h-10 py-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3 "
              onClick={() => router.push('/upload-assets')}
            >
              <div className="hidden sm:block">Upload Asset</div>
              <div className="block sm:hidden">
                <FaPlus />
              </div>
            </button>
          </div>

          <div className="flex mb-7.5 2xsm:flex-col-3  2xsm:w-[45%] md:flex-row gap-1 pb-5 dark:border-strokedark">
            <Link
              href="#"
              className={`rounded-full py-3 px-3 text-sm font-medium hover:bg-primary hover:opacity-80 hover:text-white dark:hover:bg-primary md:text-base lg:px-6 ${
                openTab === 1 ? activeClasses : inactiveClasses
              }`}
              onClick={() => setOpenTab(1)}
            >
              All
            </Link>
            <Link
              href="#"
              className={`rounded-full py-3 px-3 text-sm font-medium hover:bg-primary hover:opacity-80 hover:text-white dark:hover:bg-primary md:text-base lg:px-6 ${
                openTab === 2 ? activeClasses : inactiveClasses
              }`}
              onClick={() => setOpenTab(2)}
            >
              Completed
            </Link>
            <Link
              href="#"
              className={`rounded-full py-3 px-3 text-sm font-medium hover:bg-primary hover:opacity-80 hover:text-white dark:hover:bg-primary md:text-base lg:px-6 ${
                openTab === 3 ? activeClasses : inactiveClasses
              }`}
              onClick={() => setOpenTab(3)}
            >
              Pending
            </Link>
          </div>

          <div>
            <div className={`leading-relaxed ${openTab === 1 ? 'block' : 'hidden'}`}>
              <AssetTable
                assets={allAssetList}
                convertToCustomFormat={convertToCustomFormat}
                mintAsset={mintAsset}
                viewTx={viewTx}
                mintingAssets={mintingAssets}
                confirmedAssets={confirmedAssets}
              />
            </div>
            <div className={`leading-relaxed ${openTab === 2 ? 'block' : 'hidden'}`}>
              <AssetTable
                assets={assetUploadedList}
                convertToCustomFormat={convertToCustomFormat}
                mintAsset={mintAsset}
                viewTx={viewTx}
                mintingAssets={mintingAssets}
                confirmedAssets={confirmedAssets}
              />
            </div>
            <div className={`leading-relaxed ${openTab === 3 ? 'block' : 'hidden'}`}>
              <AssetTable
                assets={assetPendingList}
                convertToCustomFormat={convertToCustomFormat}
                mintAsset={mintAsset}
                viewTx={viewTx}
                mintingAssets={mintingAssets}
                confirmedAssets={confirmedAssets}
              />
            </div>
          </div>
        </div>
        <ToastContainer />
      </AdminLayout>
    </>
  );
};

export default Assets;
