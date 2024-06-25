import { IdentityContractAbi, IdentityContractByteCode } from '@/src/contract/IdentityContract';
import { IdentityRegistryContractAbi } from '@/src/contract/identityRegistryContract';
import { useToast } from '@/src/hooks/useToast';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAccount, useDeployContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

interface Step3Props {
  formData: any;
  setFormData: (data: any) => void;
  setIsValid: (valid: boolean) => void;
}

const Step3: React.FC<Step3Props> = ({ formData, setFormData, setIsValid }) => {
  const identityRegistryContractAddress = process.env.IDENTITY_REGISTRY_CONTRACT_ADDRESS as `0x${string}`;
  const countryCode = process.env.COUNTRY_CODE || '91';
  const { address } = useAccount();
  const [buttonText, setButtonText] = useState('Verify Identity');
  const [identityVerified, setIdentityVerified] = useState(false);
  const { data, deployContract } = useDeployContract();
  const { data: writeContractHash, writeContract } = useWriteContract();
  const { showToast } = useToast();
  const { isSuccess: isConfirmed, data: txData } = useWaitForTransactionReceipt({
    hash: data,
  });
  const { isSuccess: writeContractConfirmed, data: writeContractTxData } = useWaitForTransactionReceipt({
    hash: writeContractHash,
  });

  useEffect(() => {
    setIsValid(formData.kyc && identityVerified);
  }, [formData.kyc, identityVerified, setIsValid]);

  const verifyIdentity = async () => {
    try {
      if (!address) throw new Error('Address is not available');
      setButtonText('Verifying Identity...');
      await deployContract({
        abi: IdentityContractAbi,
        bytecode: IdentityContractByteCode,
        args: [address, true],
      });
    } catch (error) {
      console.error('Error deploying contract:', error);
      setButtonText('Submit');
    }
  };

  const updateUserIdentity = async (data: any) => {
    try {
      const response = await axios.post('/api/identity/updateUserIdentity', data);
      if (response.status === 200) {
        setButtonText('Identity Verified');
        setIdentityVerified(true);
        showToast('Identity Verified', { type: 'success' });

        writeContract({
          abi: IdentityRegistryContractAbi,
          address: identityRegistryContractAddress,
          functionName: 'registerIdentity',
          args: [address as `0x${string}`, data.identityContract, parseInt(countryCode, 10)],
        });
      }
    } catch (error) {
      console.error('Error updating user identity:', error);
      setButtonText('Submit');
    }
  };

  useEffect(() => {
    if (isConfirmed && txData?.transactionHash && txData?.contractAddress) {
      console.log('isConfirmed', isConfirmed);
      console.log('txData?.transactionHash', txData?.transactionHash);
      console.log('txData?.contractAddress', txData?.contractAddress);
      updateUserIdentity({
        identityContract: txData.contractAddress,
        transactionHash: txData.transactionHash,
      });
    }
  }, [isConfirmed, txData]);

  useEffect(() => {
    if (writeContractTxData && writeContractTxData?.transactionHash && writeContractTxData?.contractAddress) {
      console.log('writeContractTxData', writeContractTxData);
      console.log('writeContractTxData?.transactionHash', txData?.transactionHash);
      console.log('txData?.contractAddress', txData?.contractAddress);
      showToast('Identity Added to the register ', { type: 'success' });
    }
  }, [writeContractConfirmed, writeContractTxData]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="grid grid-cols-3 items-center gap-4">
        <div className="col-span-3 flex items-center justify-center">
          {!identityVerified ? (
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md disabled:bg-graydark disabled:cursor-not-allowed"
              onClick={verifyIdentity}
            >
              {buttonText}
            </button>
          ) : (
            <span className="text-lg font-semibold">Identity Verified</span>
          )}
        </div>
        <div className="col-span-3 flex items-center justify-center">
          <input
            type="checkbox"
            checked={formData.kyc || false}
            onChange={(e) => setFormData({ ...formData, kyc: e.target.checked })}
            required
            className="mr-2 rounded border-[1.5px] border-stroke font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <label className="text-boxdark-2 font-semibold text-lg">KYC confirmed</label>
        </div>
      </div>
    </div>
  );
};

export default Step3;
