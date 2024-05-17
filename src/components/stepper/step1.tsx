import React, { useEffect } from 'react';

interface Step1Props {
  formData: any;
  setFormData: (data: any) => void;
  setIsValid: (valid: boolean) => void;
}

const Step1: React.FC<Step1Props> = ({ formData, setFormData, setIsValid }) => {
  useEffect(() => {
    const isValid = formData.email.trim() !== '';
    setIsValid(isValid);
  }, [formData.email, setIsValid]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-center mb-4.5">
          <label className="mr-4 text-boxdark-2 font-semibold text-lg">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="flex-1 rounded border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1;
