import React, { useEffect } from 'react';

interface Step3Props {
  formData: any;
  setFormData: (data: any) => void;
  setIsValid: (valid: boolean) => void;
}

const Step3: React.FC<Step3Props> = ({ formData, setFormData, setIsValid }) => {
  useEffect(() => {
    setIsValid(formData.kyc);
  }, [formData.kyc, setIsValid]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="max-w-lg mx-auto p-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="col-span-3 flex items-center justify-center">
            <input
              type="checkbox"
              checked={formData.kyc}
              onChange={(e) => setFormData({ ...formData, kyc: e.target.checked })}
              required
              className="mr-2 rounded border-[1.5px] border-stroke font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <label className="text-boxdark-2 font-semibold text-lg">KYC confirmed</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
