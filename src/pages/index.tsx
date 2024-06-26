'use client';
import { NextPage } from 'next';
import { AdminLayout } from '../layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../reducers/store';
import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';
import Step1 from '../components/stepper/step1';
import Step2 from '../components/stepper/step2';
import Step3 from '../components/stepper/step3';
import Stepper from '../components/stepper/stepper';

const Home: NextPage = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data, signMessage } = useSignMessage();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState<`0x${string}`>();
  const [login, setLogin] = useState<boolean>(false);
  const [user, setUser] = useState<string>();
  const [userOnboarding, setUserOnboarding] = useState<boolean>(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    typeOfIdentification: '',
    identificationNumber: '',
    passportCountry: '',
    residentCountry: '',
    confirmation: false,
    KYC: false,
  });
  const [isStepValid, setIsStepValid] = useState([false, false, false]);

  const steps = [
    {
      title: 'Verify Email',
      describe: 'To start, You need to enter your email address and verify it.',
      content: (
        <Step1
          formData={formData}
          setFormData={setFormData}
          setIsValid={(valid) => {
            if (isStepValid[0] !== valid) {
              const newIsStepValid = [...isStepValid];
              newIsStepValid[0] = valid;
              setIsStepValid(newIsStepValid);
            }
          }}
        />
      ),
      isValid: () => isStepValid[0],
    },
    {
      title: 'Enter User details',
      describe: 'You need to enter your details that will be verified against your KYC document',
      content: (
        <Step2
          formData={formData}
          setFormData={setFormData}
          setIsValid={(valid) => {
            if (isStepValid[1] !== valid) {
              const newIsStepValid = [...isStepValid];
              newIsStepValid[1] = valid;
              setIsStepValid(newIsStepValid);
            }
          }}
        />
      ),
      isValid: () => isStepValid[1],
    },
    {
      title: 'KYC',
      describe: "Let's verify your identity",
      content: (
        <Step3
          formData={formData}
          setFormData={setFormData}
          setIsValid={(valid) => {
            if (isStepValid[2] !== valid) {
              const newIsStepValid = [...isStepValid];
              newIsStepValid[2] = valid;
              setIsStepValid(newIsStepValid);
            }
          }}
        />
      ),
      isValid: () => isStepValid[2],
    },
  ];

  useEffect(() => {
    const authenticate = async () => {
      if (signature) {
        try {
          const response = await axios.post('/api/auth/login', {
            address: address,
            signature: signature,
          });

          if (response.status !== 200) {
            setMessage('Authentication failed');
            toast.error('Authentication failed');
          } else {
            setLogin(true);
            setMessage(`Authenticated! JWT: ${response.data.token}`);
            toast.success('Authentication successful');
          }
        } catch (error: any) {
          console.error('Authentication error:', error);
          if (error.response && error.response.data && error.response.data.message) {
            setMessage(`Authentication failed: ${error.response.data.message}`);
            toast.error(`Authentication failed: ${error.response.data.message}`);
          } else {
            setMessage('Authentication failed: An unexpected error occurred');
            toast.error('Authentication failed: An unexpected error occurred');
          }
        }
      }
    };

    authenticate();
  }, [signature, address]);

  useEffect(() => {
    if (isConnected && !signature) {
      const message = `Sign this message to authenticate with Phyken. Address: ${address}`;
      signMessage({ message });
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (data) {
      setSignature(data);
    }
  }, [data]);

  useEffect(() => {
    getUserDetails();
  }, [login]);

  const User = () => {
    return <p>Welcome </p>;
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get('api/user/getUserDetails');
      if (res.status === 200) {
        const assetList = res.data;
        if (assetList.emailAddress) {
          setCurrentStep(1);
        }
        if (assetList.firstName) {
          setCurrentStep(2);
        }
        if (assetList.kycStatus === 'APPROVED') {
          setUserOnboarding(true);
          setCurrentStep(0);
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const walletNotConnected = () => (
    <div className="text-center">
      <h3 className="font-medium text-2xl text-black dark:text-white">
        Please connect your wallet to register new assets.
      </h3>
    </div>
  );

  const signSignature = () => (
    <div className="text-center">
      <h3 className="font-medium text-2xl text-black dark:text-white">Please sign with your wallet to onboard.</h3>
    </div>
  );

  const onboardUser = () => (
    <div className="container mx-auto p-4">
      <Stepper
        formData={formData}
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setOnboarding={setUserOnboarding}
      />
    </div>
  );

  const userDashboard = () => <div className="container mx-auto p-4">USER DASHBOARD COMING SOON!!!</div>;

  return (
    <AdminLayout>
      {!isConnected ? (
        walletNotConnected()
      ) : !signature ? (
        signSignature()
      ) : (
        <>
          <div>
            <div className="grid grid-cols-1 w-full gap-2 md:gap-6 pb-8">
              <div className="2xsm:flex-row sm:flex items-center ">
                <div className="flex-grow pt-3">
                  <div className="text-zinc-900 2xsm:text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal">
                    <User />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5"></div>
              {userOnboarding ? userDashboard() : onboardUser()}
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </AdminLayout>
  );
};

export default Home;
