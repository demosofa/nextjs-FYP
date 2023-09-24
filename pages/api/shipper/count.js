import { shipper } from '@controllers';
import { authenticate, authorize } from '@helpers';
import { Role } from '@shared';

async function CountOrder(req, res) {
	await shipper.countMyShipping(req, res);
	return;
}

export default authenticate(authorize(CountOrder, [Role.shipper]));
