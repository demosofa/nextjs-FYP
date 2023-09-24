import { auth } from '@controllers';
import { db } from '@helpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function refreshToken(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await db.connect();
	await auth.refresh(req, res);
}
