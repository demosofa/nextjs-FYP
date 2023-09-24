import { admin } from '@controllers';
import { authenticate, authorize, db } from '@helpers';
import { Role } from '@shared';

async function profilesIndex(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await admin.getAllProfile(req, res);
			break;
	}
}

export default authenticate(authorize(profilesIndex, [Role.admin]));
