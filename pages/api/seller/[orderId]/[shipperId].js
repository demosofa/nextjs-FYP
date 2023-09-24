import { seller } from '@controllers';
import { authenticate, authorize } from '@helpers';
import { Role } from '@shared';

async function withShipperId(req, res) {
	switch (req.method.toLowerCase()) {
		case 'get':
			await seller.getShipperOrder(req, res);
			break;
		case 'patch':
			await seller.validateShipperOrder(req, res);
			break;
	}
}

export default authenticate(authorize(withShipperId, [Role.seller]));
