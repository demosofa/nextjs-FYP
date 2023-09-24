import { admin } from '@controllers';
import { authenticate, authorize } from '@helpers';

import Role from '@shared/Role';

async function profitMonthly(req, res) {
	switch (req.method.toLowerCase()) {
		case 'get':
			await admin.profit(req, res);
			break;
	}
}

export default authenticate(authorize(profitMonthly, [Role.admin]));
