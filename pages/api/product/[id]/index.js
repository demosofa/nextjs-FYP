import { product } from '@controllers';
import { authenticate, authorize, db } from '@helpers';
import { Role } from '@shared';

export default async function ProductId(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await product.read(req, res);
			break;
		case 'patch':
			await authenticate(authorize(product.patch, [Role.admin, Role.seller]))(
				req,
				res
			);
			break;
		case 'delete':
			await authenticate(authorize(product.delete, [Role.admin]))(req, res);
			break;
	}
}
