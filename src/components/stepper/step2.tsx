import React, { useEffect } from 'react';

interface Step2Props {
  formData: any;
  setFormData: (data: any) => void;
  setIsValid: (valid: boolean) => void;
}

const Step2: React.FC<Step2Props> = ({ formData, setFormData, setIsValid }) => {
  useEffect(() => {
    const isValid =
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.dateOfBirth.trim() !== '' &&
      formData.typeOfIdentification.trim() !== '' &&
      formData.identificationNumber.trim() !== '' &&
      formData.passportCountry.trim() !== '' &&
      formData.residentCountry.trim() !== '' &&
      formData.confirmation;

    setIsValid(isValid);
  }, [
    formData.firstName,
    formData.lastName,
    formData.dateOfBirth,
    formData.typeOfIdentification,
    formData.identificationNumber,
    formData.passportCountry,
    formData.residentCountry,
    formData.confirmation,
    setIsValid,
  ]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 gap-y-4.5 p-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-boxdark-2 font-semibold text-lg text-right col-span-1">First name:</label>
          <input
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            className="col-span-2 rounded border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-boxdark-2 font-semibold text-lg text-right col-span-1">Last name:</label>
          <input
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            className="col-span-2 rounded border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-boxdark-2 font-semibold text-lg text-right col-span-1">Date of birth:</label>
          <input
            type="date"
            placeholder="Enter your date of birth"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            required
            className="col-span-2 rounded border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-boxdark-2 font-semibold text-lg text-right col-span-1">Type of Identity:</label>
          <input
            type="text"
            placeholder="Enter the type of identity"
            value={formData.typeOfIdentification}
            onChange={(e) => setFormData({ ...formData, typeOfIdentification: e.target.value })}
            required
            className="col-span-2 rounded border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-boxdark-2 font-semibold text-lg text-right col-span-1">Identification number:</label>
          <input
            type="text"
            placeholder="Enter identification number"
            value={formData.identificationNumber}
            onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
            required
            className="col-span-2 rounded border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-boxdark-2 font-semibold text-lg text-right col-span-1">Country of citizenship:</label>
          <input
            type="text"
            placeholder="Enter your country of citizenship"
            value={formData.passportCountry}
            onChange={(e) => setFormData({ ...formData, passportCountry: e.target.value })}
            required
            className="col-span-2 rounded border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="text-boxdark-2 font-semibold text-lg text-right col-span-1">Country of residence:</label>
          <input
            type="text"
            placeholder="Enter your country of residence"
            value={formData.residentCountry}
            onChange={(e) => setFormData({ ...formData, residentCountry: e.target.value })}
            required
            className="col-span-2 rounded border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="col-span-3 flex items-center justify-center">
            <input
              type="checkbox"
              checked={formData.confirmation}
              onChange={(e) => setFormData({ ...formData, confirmation: e.target.checked })}
              required
              className="mr-2 rounded border-[1.5px] border-stroke font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <label className="text-boxdark-2 font-semibold text-lg">I confirm</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
