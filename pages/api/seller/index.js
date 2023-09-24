import { seller } from '@controllers';
import { authenticate, authorize, db } from '@helpers';
import { Role } from '@shared';

async function sellerIndex(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await seller.todayValidated(req, res);
			break;
	}
}

export default authenticate(authorize(sellerIndex, [Role.seller]));
