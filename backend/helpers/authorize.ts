import type { NextApiHandler, NextApiResponse } from 'next';

import Request from './type';

export default function authorize(
	handler: NextApiHandler,
	roles: string[]
): NextApiHandler {
	return (req: Request, res: NextApiResponse): unknown => {
		if (!roles.includes(req.user.role)) return res.status(403).end();
		return handler(req, res);
	};
}
