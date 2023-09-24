import { admin } from '@controllers';
import { authenticate, authorize } from '@helpers';

import Role from '@shared/Role';

async function income(req, res) {
	switch (req.method.toLowerCase()) {
		case 'get':
			await admin.income(req, res);
			break;
	}
}

export default authenticate(authorize(income, [Role.admin]));
