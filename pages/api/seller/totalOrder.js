import { seller } from '@controllers';
import { authenticate, authorize } from '@helpers';
import { Role } from '@shared';

async function totalOrder(req, res) {
	switch (req.method.toLowerCase()) {
		case 'get':
			await seller.totalOrder(req, res);
			break;
	}
}

export default authenticate(authorize(totalOrder, [Role.seller]));
