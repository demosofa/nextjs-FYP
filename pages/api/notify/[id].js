import { notification } from '@controllers';
import { authenticate } from '@helpers';

async function notifyId(req, res) {
	switch (req.method.toLowerCase()) {
		case 'patch':
			await notification.readNotification(req, res);
			break;
		case 'delete':
			await notification.deleteNotification(req, res);
			break;
	}
}

export default authenticate(notifyId);
