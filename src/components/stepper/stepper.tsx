// components/Stepper.tsx
import axios from 'axios';
import React from 'react';

interface Step {
  title: string;
  describe: string;
  content: React.ReactNode;
  isValid: () => boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: any;
  setOnboarding: (bool: boolean) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, setCurrentStep, formData, setOnboarding }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (steps[currentStep].isValid()) {
      // TODO: add error handling cases
      if (currentStep === 0) {
        await updateUserEmail(formData.email);
        setCurrentStep(currentStep + 1);
      }
      if (currentStep === 1) {
        await updateUserDetails(formData);
        setCurrentStep(currentStep + 1);
      }
      if (currentStep === 2) {
        await updateUserKYCStatus();
        setOnboarding(true);
        setCurrentStep(0);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold 
                ${currentStep === index ? 'bg-meta-3 text-white' : 'bg-graydark text-white'}`}
              >
                {index + 1}
              </div>
              <span className={`ml-2 ${currentStep === index ? 'text-meta-3' : 'text-bodydark'}`}>{step.title}</span>
            </div>
            {index < steps.length - 1 && <div className="w-100 h-1 bg-graydark mx-4" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1 bg-gray pt-7 pl-7">
        <h2 className="text-title-md font-satoshi mb-4">{steps[currentStep].title}</h2>
        <span className="text-sm">{steps[currentStep].describe}</span>
        <form onSubmit={handleSubmit}>
          <div className="p-4 ">{steps[currentStep].content}</div>
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4 float-right">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md disabled:bg-graydark disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Stepper;

async function updateUserEmail(email: string) {
  try {
    const res = await axios.post('/api/user/updateUserEmail', {
      email: email,
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

async function updateUserDetails(formDetails: any) {
  try {
    const res = await axios.post('/api/user/updateUserDetails', {
      firstName: formDetails.firstName,
      lastName: formDetails.lastName,
      dateOfBirth: formDetails.dateOfBirth,
      typeOfIdentification: formDetails.typeOfIdentification,
      identificationNumber: formDetails.identificationNumber,
      passportCountry: formDetails.passportCountry,
      residentCountry: formDetails.residentCountry,
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

async function updateUserKYCStatus() {
  try {
    const res = await axios.post('/api/user/updateUserDetails', {
      kycStatus: 'APPROVED',
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}
