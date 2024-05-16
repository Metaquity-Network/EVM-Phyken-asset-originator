'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AdminLayout } from '@/src/layout';
import Breadcrumb from '@/src/components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useWeb3Auth } from '@/src/hooks/useWeb3Auth';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from 'react-toastify';

const FractionalizeAsset: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { web3auth, provider } = useWeb3Auth();
  const [assetDetails, setAssetDetails] = useState<any>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [numberOfFractions, setNumberOfFractions] = useState<number>(0);

  const handleInputChange = (e: any) => {
    setNumberOfFractions(e.target.value);
  };

  useEffect(() => {
    getAssetById();
  }, []);

  const getAssetById = async () => {
    const res = await axios.get(`/api/assets/getAssetById`, { params: { id: router.query.assetId } });
    if (res.status === 200) {
      const asset = res.data;
      console.log(asset);
      setAssetDetails(asset);
    }
  };

  const fractionalizeAsset = async () => {
    if (numberOfFractions <= 0) {
      showToast('Please enter a valid fractionalization count', { type: 'error' });
      return;
    }
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    setIsDisabled(true);
    // await web3auth.initModal();
    // if (web3auth.provider) {
    //   const rpc = new PolkadotRPC(web3auth.provider);
    //   showToast('Please wait, Your asset is being fractionalized', { type: 'info' });
    //   try {
    //     // TODO: Get the asset details
    //     // const latestAssetid = await rpc.getLatestAsset();
    //     const mintBlock = (await rpc.fractionalizeNFT(
    //       assetDetails.nftDetails.nftCollectionID as number,
    //       assetDetails.nftDetails.nftItem as number,
    //       assetDetails.nftDetails.nftCollectionID as number,
    //       numberOfFractions as number,
    //     )) as object;
    //     showToast('Asset Fractionalized', { type: 'success' });

    //     await fetch('/api/fractionalization/fractionalize', {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         ...mintBlock,
    //         fractionalizationPrice: (assetDetails.assetPrice / numberOfFractions) as unknown as string,
    //         id: assetDetails._id,
    //       }),
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     router.push(`token-created/${router.query.assetId}`);
    //   } catch (error) {
    //     console.error('Error creating NFT:', error);
    //   }
    // }
  };

  return (
    <>
      <AdminLayout>
        <Breadcrumb pageName={['Fractionalize Asset']} />
        {assetDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2  md:col-span-1 px-10 pt-10 bg-bodydark1 dark:bg-boxdark">
              <div className="w-1/2 2xsm:w-full py-5">
                <div className="text-xl font-semibold ">Asset Detail</div>
                <div className="pt-5 flex">
                  <p className="font-bold">Name: </p>
                  <p>{assetDetails.name}</p>
                </div>
                <div className="pt-5">
                  <p className="font-bold">Description: </p>
                  <p>{assetDetails.description}</p>
                </div>
                <div className="text-m bold font-medium 2xsm:pt-10 md:pt-15">Category - {assetDetails.category}</div>
                <div className="font-bold text-1xl">${assetDetails.assetPrice}</div>
              </div>
              <div className="w-1/2 2xsm:w-full h-64 2xsm:pt-4 md:pt-0">
                <Image className="h-[85%]" width={350} height={350} src={assetDetails.assetImageURL} alt="Cards" />
              </div>
            </div>
            <div className="grid-flow-col p-10 md:pt-45 "></div>
            <div className="md:col-span-1 md:pt-10">
              <div className="grid grid-flow-col justify-stretch 2xsm:grid-flow-row md:grid-flow-col">
                <div className="font-bold pt-2">Enter the Number of fractions</div>
                <div className="w-full px-4">
                  <input
                    type="number"
                    placeholder="Number of fractions"
                    value={numberOfFractions}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {/* <p className="pt-5 text-sm">Price per fraction: calculated automatically.</p> */}
                  <p className="text-sm text-danger">Warning that the user will not be able to change it later.</p>
                </div>
              </div>
              <div className="pt-15 flex justify-center ">
                <button
                  className="flex flex-row 2xsm:w-full md:w-1/2 h-10 pt-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3 disabled:opacity-70 disabled:hover:bg-primary"
                  onClick={() => fractionalizeAsset()}
                  disabled={isDisabled}
                >
                  <div>Confirm</div>
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <ToastContainer />
      </AdminLayout>
    </>
  );
};

export default FractionalizeAsset;
