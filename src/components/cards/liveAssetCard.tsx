import Image from 'next/image';
import { LiveAssetCardProps } from '@/src/types/cards';
import ProgressBar from '../progress/progressBar';
import { numberToCommaSeparator } from '@/src/helper/numberToCommaSeparator';
import { convertNumberToMonthsAndYears } from '@/src/helper/numberToYearsAndMonths';
import { useRouter } from 'next/router';

const LiveAssetCard: React.FC<LiveAssetCardProps> = (cardProps) => {
  const router = useRouter();
  const shortDescription = (description: string) => {
    const maxLength = 100;
    if (description.length <= maxLength) {
      return description;
    } else {
      return description.slice(0, maxLength) + '....';
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-gray-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div>
        <img className="w-full h-[300px]" src={cardProps.image} alt="Cards" />
      </div>

      <div className="px-6 pb-2 border-b-[1px]">
        <h4 className="text-xl font-semibold text-black hover:text-primary dark:text-white dark:hover:text-primary">
          <div>{cardProps.title}</div>
        </h4>
        <p>{shortDescription(cardProps.description)}</p>
        {cardProps.tags.length > 0
          ? cardProps.tags.map((tag: string, index: number) => (
              <span className="border rounded-full bg-secondary px-2 mr-2 text-black" key={index}>
                {tag}{' '}
              </span>
            ))
          : null}
      </div>
      <div className="p-4">
        <p className="pb-2 font-bold">${numberToCommaSeparator(cardProps.lockedValue)} funded</p>
        <ProgressBar percentage={(cardProps.lockedValue / cardProps.totalValue) * 100} />
      </div>
      <div className="grid grid-cols-2 p-6 text-center">
        <div className="flex flex-col pb-2 justify-center">
          <p>Fixed returns (IRR)</p>
          <p className="font-bold">{cardProps.fixedRate}%</p>
        </div>
        <div className="flex flex-col pb-2 justify-center">
          <p>Minimum investment</p>
          <p className="font-bold">{numberToCommaSeparator(cardProps.minimumInvestment)}</p>
        </div>
        <div className="flex flex-col pb-2 justify-center">
          <p>Lockin Period</p>
          <div className="font-bold">{convertNumberToMonthsAndYears(cardProps.lockPeriod)}</div>
        </div>
        <div className="flex flex-col pb-2 justify-center">
          <p>Fixed rate:</p>
          <p className="font-bold">{cardProps.fixedRate}%</p>
        </div>
      </div>
      <div>
        <div className="p-4">
          <button
            className="flex flex-row w-full h-10 py-2 justify-center rounded-full bg-primary hover:bg-opacity-90 p-3 font-medium text-gray gap-3"
            onClick={() => router.push(`/assets/${cardProps.id}`)}
          >
            <div>View Asset</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAssetCard;
