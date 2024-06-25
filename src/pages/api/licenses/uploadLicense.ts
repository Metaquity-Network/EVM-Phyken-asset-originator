import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseURL = process.env.BASE_URL || 'http://localhost:4000';
  const authToken = req.headers.cookie?.split('%22')[1];

  const formData = new FormData();
  formData.append('licenseNumber', req.body.licenseNumber);
  formData.append('category', req.body.category);
  formData.append('licenseValidity', req.body.licenseValidity);
  formData.append('country', req.body.country);
  formData.append('state', req.body.state);
  formData.append('licenseURL', req.body.licenseURL);

  try {
    const response = await axios.post(`${baseURL}/licenses/uploadLicense`, req.body, {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Upload License Error:', error.response.data.message);
    res.status(500).json({ message: error.response?.data?.message || 'Internal Server Error' });
  }
}
