import { auth } from '@controllers';
import { db } from '@helpers';

export default async function register(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'post':
			await auth.register(req, res);
			break;
	}
}
