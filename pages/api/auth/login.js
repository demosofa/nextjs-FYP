import { auth } from '@controllers';
import { db } from '@helpers';

export default async function login(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'post':
			await auth.login(req, res);
			break;
	}
}
