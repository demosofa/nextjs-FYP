import type { NextApiHandler, NextApiResponse } from 'next';

import { auth } from '@controllers/index';

import { Token } from '.';
import Request from './type';

export default function authenticate(handler: NextApiHandler): NextApiHandler {
	return async (req: Request, res: NextApiResponse) => {
		const authProp = req.headers.authorization;
		if (!authProp) return res.status(401).end();

		try {
			const currentAccessToken = authProp.split(' ')[1];
			const value = Token.verifyAccessToken(currentAccessToken) as {
				[userId: string]: string;
				accountId: string;
				role: string;
			};

			const check = await auth.checkAllowed(value.accountId);
			if (check === 401) return res.status(401).end();
			if (check === 403)
				return res.status(403).json('This account has been blocked');

			req.user = {
				id: value.userId,
				role: value.role,
				accountId: value.accountId
			};

			return handler(req, res);
		} catch (err) {
			return res.status(401).json({ message: 'Token is expired' });
		}
	};
}
