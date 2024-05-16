export type CardTwoItemProps = {
  imageSrc?: string;
  name?: string;
  count?: string | number;
  url?: string;
};

export type LiveAssetCardProps = {
  id: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  totalValue: number;
  lockedValue: number;
  fixedRate: number;
  lockPeriod: number;
  minimumInvestment: number;
  dealValue: number;
};
