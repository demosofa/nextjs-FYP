import { seller } from '@controllers';
import { authenticate, authorize } from '@helpers';
import { Role } from '@shared';

async function topSold(req, res) {
	switch (req.method.toLowerCase()) {
		case 'get':
			await seller.topSold(req, res);
			break;
	}
}

export default authenticate(authorize(topSold, [Role.seller]));
