import { serializeCookie } from '@/src/lib';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res
    .status(200)
    .setHeader('Set-Cookie', serializeCookie('server-auth', {}, { path: '/', expires: new Date(Date.now()) }))
    .json({ logout: true });
}
