import { admin } from '@controllers';
import { authenticate, authorize, db } from '@helpers';
import { Role } from '@shared';

async function adminOrder(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await admin.getAllOrder(req, res);
			break;
		case 'delete':
			await admin.deleteOrder(req, res);
			break;
	}
}

export default authenticate(authorize(adminOrder, Role.admin));
