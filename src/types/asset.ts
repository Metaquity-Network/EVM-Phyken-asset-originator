export type AssetList = {
  [x: string]: any;
  assetPrice: string;
  assetStatus: string;
  assetURL: string;
  category: string;
  description: string;
  id: string;
  licenseID: string;
  name: string;
  nftDetails: NftDetails;
  nftFractionalizationDetails: any;
};

type NftDetails = {
  tokenMintingTx: string;
};
