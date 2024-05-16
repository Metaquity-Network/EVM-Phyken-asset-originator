import type { NextPage } from 'next';
import { Connect } from '../wallet-connect/wallet-connect';

const SignInForm: NextPage = () => {
  return (
    <form className="flex flex-col items-center justify-start gap-[12px] p-5 text-black-2">
      <div className="flex flex-col items-center justify-center pt-0 px-0 pb-6">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-9 text-2xl font-bold sm:text-title-xl2 pt-5">User Onboarding and Dashboard</h2>
          <div className="flex flex-col relative text-base font-semibold font-inter text-gray-coolgray800 justify-center">
            Let's get started!
          </div>
          <div className="relative text-sm leading-[24px] font-inter text-gray-coolgray500">
            Login by Your Secure Account
          </div>
        </div>
      </div>
      <div className="pb-5">
        <Connect />
      </div>

      <div className="relative text-sm leading-[26px] font-inter text-left">
        <span className="text-graydark">{`Questions? Email us at `}</span>
        <a className="text-primary" href="mailto:hello@metaquity.xyz">
          hello@metaquity.xyz
        </a>
      </div>
    </form>
  );
};

export default SignInForm;
