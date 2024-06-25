'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/src/layout';
import Breadcrumb from '@/src/components/Breadcrumbs/Breadcrumb';
import axios, { AxiosResponse } from 'axios';
import { LicenseList } from '@/src/types/license';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from 'react-toastify';

const UploadAssets: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [licenseList, setLicenseList] = useState<LicenseList[]>([]);
  const [file, setFile] = useState<File>();
  const [assetimagePreview, setAssetImagePreview] = useState<any>();
  const [assetContentPreview, setAssetContentPreview] = useState<any>();
  const [orgPreview, setOrgPreview] = useState<any>();
  const [formSubmitData, setFormSubmitData] = useState({});
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);

  useEffect(() => {
    async function getAllLicense() {
      try {
        const response: AxiosResponse = await axios.get('/api/licenses/getLicenses');
        setLicenseList(response.data);
        if (response.data.length > 0) {
          setFormSubmitData((prevData) => ({
            ...prevData,
            licenseID: response.data[0].id,
          }));
        }
      } catch (error: any) {
        showToast('Unable to get all licenses', { type: 'error' });
      }
    }
    getAllLicense();
  }, []);

  useEffect(() => {
    return upload?.abort();
  }, []);

  useEffect(() => {
    setUpload(null);
  }, [file]);

  const renderedItems = licenseList.map((license, index) => (
    <option key={index} value={license.id}>
      {license.licenseNumber}
    </option>
  ));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormSubmitData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const selectedFile = event.target.files?.[0] as File;
    setFile(selectedFile);
    setFormSubmitData({
      ...formSubmitData,
      // file: selectedFile,
    });

    // Read the selected file and display it as an image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'assetImage') {
        setAssetImagePreview(e.target?.result);
      }
      if (type === 'assetContract') {
        setAssetContentPreview(selectedFile.name);
      }
      if (type === 'org') {
        setOrgPreview(selectedFile.name);
      }
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

      if (type === 'assetImage') {
        setFormSubmitData({
          ...formSubmitData,
          // assetImageURL: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uuidFileName}`,
          assetImageURL: `s3://metaquity-presigned/Frame 14.png`,
        });
        showToast('Asset Image uploaded', { type: 'success' });
      }
      if (type === 'assetContract') {
        setFormSubmitData({
          ...formSubmitData,
          // assetContractURL: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uuidFileName}`,
          assetContractURL: `s3://metaquity-presigned/Frame 14.png`,
        });
        showToast('Asset contract file uploaded', { type: 'success' });
      }
      if (type === 'org') {
        setFormSubmitData({
          ...formSubmitData,
          // orgStructureURL: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uuidFileName}`,
          orgStructureURL: `s3://metaquity-presigned/Frame 14.png`,
        });
        showToast('Organization structure file uploaded', { type: 'success' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formSubmitData);
    // TODO: remove hardcoded urls
    setFormSubmitData({
      ...formSubmitData,
      assetImageURL: `s3://metaquity-presigned/Frame 14.png`,
      orgStructureURL: `s3://metaquity-presigned/Frame 14.png`,
      assetContractURL: `s3://metaquity-presigned/Frame 14.png`,
    });
    try {
      const res = await fetch('/api/assets/uploadAsset', {
        method: 'POST',
        body: JSON.stringify({
          ...formSubmitData,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status !== 500) {
        showToast('Uploaded a new asset', { type: 'success' });
        router.push('/upload-assets/asset-uploaded');
      } else {
        showToast('Unable to upload the asset', { type: 'error' });
      }
    } catch (error: any) {
      showToast(error.message, { type: 'error' });
    }
  };

  return (
    <>
      <AdminLayout>
        <Breadcrumb pageName={['Upload Assets']} />

        <div className="gap-9 sm:grid-cols-2 md:w-[50%] 2xsm:w-[100%]">
          <div className="flex flex-col gap-9">
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Name<sup className="text-red">*</sup>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the asset name"
                    name="name"
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Category<sup className="text-red">*</sup>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the asset category"
                    name="category"
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Description<sup className="text-red">*</sup>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter the asset description"
                    name="description"
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Asset Image<sup className="text-red">*</sup>
                  </label>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      required
                      onChange={(e) => handleFileChange(e, 'assetImage')}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {assetimagePreview ? (
                        <img src={assetimagePreview} alt="Uploaded Preview" className="w-45 h-45 rounded" />
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
                      <p className="mt-1.5">PNG, JPG, or JPEG</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Asset contract document<sup className="text-red">*</sup>
                  </label>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      required
                      onChange={(e) => handleFileChange(e, 'assetContract')}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {assetContentPreview ? (
                        <>
                          <img src={'images/pdf.png'} alt="Uploaded Preview" className="w-15 h-20 rounded" />
                          <p>{assetContentPreview}</p>
                        </>
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
                      <p className="mt-1.5">PDF docs only</p>
                      <p>(max, 5mb)</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Org structure document<sup className="text-red">*</sup>
                  </label>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      required
                      onChange={(e) => handleFileChange(e, 'org')}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {orgPreview ? (
                        <>
                          <img src={'images/pdf.png'} alt="Uploaded Preview" className="w-15 h-20 rounded" />
                          <p>{orgPreview}</p>
                        </>
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
                      <p className="mt-1.5">PDF docs only</p>
                      <p>(max, 5mb)</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Project Value<sup className="text-red">*</sup>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter the asset cost (in dollars)"
                    name="assetPrice"
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white font-semibold text-lg">
                    Licenses<sup className="text-red">*</sup>
                  </label>
                  <div className="grid grid-cols-12">
                    <div className="relative z-20 dark:bg-form-input col-span-11">
                      {licenseList.length > 0 ? (
                        <div>
                          <select
                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            name="licenseID"
                            onChange={handleInputChange}
                            required
                          >
                            {renderedItems}
                          </select>
                          <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g opacity="0.8">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                  fill="#637381"
                                ></path>
                              </g>
                            </svg>
                          </span>
                        </div>
                      ) : (
                        <div className="pt-3 text-sm"> Please upload license </div>
                      )}
                    </div>
                    <div className="justify-center align-middle px-4 py-1">
                      <div className="group relative inline-block">
                        <button
                          className="rounded-full bg-primary h-10 w-10 flex justify-center py-3 text-gray hover:opacity-80 dark:hover:opacity-70"
                          onClick={(event) => {
                            event.preventDefault();
                            router.push('upload-license');
                          }}
                        >
                          <FaPlus />
                        </button>
                        <div className="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded bg-black py-1.5 px-4.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                          <span className="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-black"></span>
                          Upload new Licenses
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:opacity-80 dark:hover:opacity-70"
                >
                  Upload Asset
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

export default UploadAssets;
