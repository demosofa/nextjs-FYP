import { auth } from '@controllers';
import { db } from '@helpers';

async function logout(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'post':
			await auth.logout(req, res);
			break;
	}
}

export default logout;
