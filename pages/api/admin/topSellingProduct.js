import { admin } from '@controllers';
import { authenticate, authorize } from '@helpers';
import { Role } from '@shared';

async function topSellingProduct(req, res) {
	switch (req.method.toLowerCase()) {
		case 'get':
			await admin.topSold(req, res);
			break;
	}
}

export default authenticate(authorize(topSellingProduct, [Role.admin]));
