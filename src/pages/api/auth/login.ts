import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  try {
    const response = await axios.post(`${baseURL}/auth/login`, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    setCookie('server-auth', JSON.stringify(data), { req, res, maxAge: 60 * 60 * 24 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
}
