import { order } from '@controllers';
import { authenticate, authorize, db } from '@helpers';
import { Role } from '@shared';

async function orderIndex(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await order.lstOrder(req, res);
			break;
		case 'post':
			await authorize(order.addOrder, [Role.customer])(req, res);
	}
}

export default authenticate(orderIndex);
