'use client';

import Breadcrumb from '@/src/components/Breadcrumbs/Breadcrumb';
import { useToast } from '@/src/hooks/useToast';
import { AdminLayout } from '@/src/layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

const UploadLicenses: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [formSubmitData, setFormSubmitData] = useState({});

  useEffect(() => {
    return upload?.abort();
  }, []);

  useEffect(() => {
    setUpload(null);
  }, [file]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormSubmitData({
      ...formSubmitData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] as File;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result);
    };
    reader.readAsDataURL(selectedFile);
    const uuidFileName = uuidv4().toString();
    const params: PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'metaquity-upload',
      Key: uuidFileName,
      Body: selectedFile,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };
    const s3 = new S3({
      region: process.env.AWS_S3_REGION || 'ap-northeast-1',
      credentials: {
        accessKeyId: process.env.AWS_S3_REGION_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_S3_REGION_SECRET_ACCESS_KEY || '',
      },
    });
    try {
      const upload = s3.upload(params);
      setUpload(upload);
      upload.on('httpUploadProgress', (p) => {
        console.log(p.loaded / p.total);
      });
      await upload.promise();
      setFormSubmitData({
        ...formSubmitData,
        licenseURL: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uuidFileName}`,
      });
      showToast('License file uploaded', { type: 'success' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/licenses/uploadLicense', formSubmitData);
      showToast('User License uploaded', { type: 'success' });
      router.push('/');
    } catch (error: any) {
      console.error('Server Error:', error.response.status, error.response.data);
      showToast(error.message, { type: 'error' });
    }
  };

  return (
    <>
      <AdminLayout>
        <Breadcrumb pageName={['Upload Assets', 'Upload License']} />

        <div className="gap-9 sm:grid-cols-2 md:w-[50%] 2xsm:w-[100%]">
          <div className="flex flex-col gap-9">
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    License No <sup className="text-red">*</sup>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the license number"
                    name="licenseNumber"
                    onChange={handleInputChange}
                    required
                    autoComplete="false"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Category
                    <sup className="text-red">*</sup>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the license category"
                    name="category"
                    onChange={handleInputChange}
                    required
                    autoComplete="false"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Validity
                    <sup className="text-red">*</sup>
                  </label>
                  <input
                    type="date"
                    placeholder="Enter the license validity"
                    name="licenseValidity"
                    onChange={handleInputChange}
                    required
                    autoComplete="false"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Country
                    <sup className="text-red">*</sup>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the country of license"
                    name="country"
                    onChange={handleInputChange}
                    required
                    autoComplete="false"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    State
                    <sup className="text-red">*</sup>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the state of license"
                    name="state"
                    onChange={handleInputChange}
                    required
                    autoComplete="false"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Upload document<sup className="text-red">*</sup>
                  </label>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Uploaded Preview" className="w-45 h-45 rounded" />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                              fill="#3C50E0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                              fill="#3C50E0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                              fill="#3C50E0"
                            />
                          </svg>
                        </span>
                      )}
                      <p>
                        <span className="text-primary dark:text-white">Click to upload</span> or drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG, or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>
                </div>
                <button className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:opacity-80 dark:hover:opacity-70 md:w-[50%] 2xsm:w-[100%]">
                  Upload License
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </AdminLayout>
    </>
  );
};

export default UploadLicenses;
