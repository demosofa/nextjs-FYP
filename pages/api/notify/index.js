import { notification } from '@controllers';
import { authenticate } from '@helpers';

async function notify(req, res) {
	switch (req.method.toLowerCase()) {
		case 'get':
			await notification.getAllForUser(req, res);
			break;
		case 'post':
			await notification.addNotification(req, res);
			break;
	}
}

export default authenticate(notify);
