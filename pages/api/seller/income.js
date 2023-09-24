import { seller } from '@controllers';
import { authenticate, authorize } from '@helpers';
import { Role } from '@shared';

async function income(req, res) {
	switch (req.method.toLowerCase()) {
		case 'get':
			await seller.income(req, res);
			break;
	}
}

export default authenticate(authorize(income, [Role.seller]));
