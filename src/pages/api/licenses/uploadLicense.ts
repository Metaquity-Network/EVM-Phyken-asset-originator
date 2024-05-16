import axios from 'axios';
import { NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: any) {
  const version = process.env.VERSION || 'v1';
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  const authToken = req.headers.cookie?.split('%22')[1];

  const formData = new FormData();
  formData.append('licenseNumber', req.body.licenseNumber);
  formData.append('category', req.body.category);
  formData.append('licenseValidity', req.body.licenseValidity);
  formData.append('country', req.body.country);
  formData.append('state', req.body.state);
  formData.append('licenseURL', req.body.licenseURL);
  try {
    const response = await axios.post(`${baseURL}${version}/licenses/uploadLicense`, formData, {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
    });
    const data = response.data;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json(error.data.message);
  }
}
