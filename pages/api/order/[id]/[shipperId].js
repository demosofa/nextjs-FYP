import { user } from '@controllers';
import { authenticate } from '@helpers';

async function shipperId(req, res) {
	switch (req.method.toLowerCase()) {
		case 'patch':
			await user.checkQR(req, res);
			break;
	}
}

export default authenticate(shipperId);
