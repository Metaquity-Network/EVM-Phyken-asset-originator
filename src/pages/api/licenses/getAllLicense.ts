import axios from 'axios';
import { NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: any) {
  const version = process.env.VERSION || 'v1';
  const baseURL = process.env.BASE_URL || 'http://localhost:4000';
  const authToken = req.headers.cookie?.split('%22')[1];
  try {
    const response = await axios.get(`${baseURL}${version}/licenses/getLicense`, {
      headers: {
        ContentType: 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
    });
    const data = response.data;
    res.status(200).json(data);
  } catch (error: any) {
    console.log('error', error.response.data);
    res.status(500).json(error.response.data);
  }
}
