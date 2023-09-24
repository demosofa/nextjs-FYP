import { auth } from '@controllers';

export default async function forgotPwd(req, res) {
	switch (req.method.toLowerCase()) {
		case 'post':
			await auth.forgot(req, res);
			break;
	}
}
