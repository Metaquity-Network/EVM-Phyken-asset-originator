import React from 'react';
import { AssetList } from '@/src/types/asset';
import { FaQuestionCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface AssetTableProps {
  assets: AssetList[];
  convertToCustomFormat: (uuid: string) => string;
  mintAsset: (asset: AssetList) => void;
  viewTx: (hash: string) => void;
  mintingAssets: Record<string, boolean>;
  confirmedAssets: Record<string, boolean>;
}

const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  convertToCustomFormat,
  mintAsset,
  viewTx,
  mintingAssets,
  confirmedAssets,
}) => {
  const router = useRouter();

  return (
    <div className="rounded-sm p-4 dark:border-strokedark dark:bg-boxdark  w-[95%]">
      {assets.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="grid md:grid-cols-12 grid-cols-6 py-2 text-start md:text-left">
            <div className="md:col-span-2 hidden md:block">
              <p className="text-l px-4 font-bold">AssetD</p>
            </div>
            <div className="col-span-2 ">
              <p className="text-l font-bold">Name</p>
            </div>
            <div className="col-span-2 hidden md:block">
              <p className="text-l  font-bold">Category</p>
            </div>
            <div className="md:col-span-2 hidden md:block">
              <p className="text-l font-bold">Price</p>
            </div>
            <div className="md:col-span-2 flex">
              <p className=" text-l font-bold pr-2">Status</p>
              <div className="group relative inline-block">
                <FaQuestionCircle />
                <div className="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded bg-black py-1.5 px-4.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                  <span className="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-black"></span>
                  Link to blockchain tx
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-l font-bold">{}</p>
            </div>
          </div>
          {assets.map((asset) => (
            <div key={asset.id} className="grid md:grid-cols-12 grid-cols-6 py-2 text-start md:text-left">
              <div className="md:col-span-2 hidden md:block">
                <p className="text-sm px-4">{convertToCustomFormat(asset.id)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm">{asset.name}</p>
              </div>
              <div className="md:col-span-2 hidden md:block">
                <p className="text-sm">{asset.category}</p>
              </div>
              <div className="md:col-span-2 hidden md:block">
                <p className="text-sm ">{asset.assetPrice}</p>
              </div>
              <div className="md:col-span-2">
                {asset.nftFractionalizationDetails ? (
                  <p
                    className="text-sm hover:cursor-pointer"
                    onClick={() => viewTx(asset.nftFractionalizationDetails.fractionalizationBlockMint)}
                  >
                    Asset Fractionalized
                  </p>
                ) : asset?.nftDetails ? (
                  <p className="text-sm hover:cursor-pointer" onClick={() => viewTx(asset.nftDetails.nftBlockMint)}>
                    NFT Minted
                  </p>
                ) : null}
                <p className="text-sm "></p>
              </div>
              <div className="md:col-span-2">
                {asset.nftFractionalizationDetails ? null : asset?.nftDetails ? (
                  <button
                    className="h-10 w-full py-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3"
                    onClick={() => router.push(`/fractionalize-asset/${asset.id}`)}
                  >
                    Fractionalize
                  </button>
                ) : (
                  <button
                    className="h-10 py-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3"
                    onClick={() => mintAsset(asset)}
                    disabled={mintingAssets[asset.id]}
                  >
                    {mintingAssets[asset.id] ? 'Minting...' : confirmedAssets[asset.id] ? 'Fractionalize' : 'Mint NFT'}
                  </button>
                )}
                <p className="text-sm "></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p>No assets found</p>
        </div>
      )}
    </div>
  );
};

export default AssetTable;
