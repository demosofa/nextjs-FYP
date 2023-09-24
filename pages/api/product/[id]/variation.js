import { product } from '@controllers';
import { db } from '@helpers';

async function productVariation(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await product.getVariation(req, res);
			break;
		case 'patch':
			await product.patchVariation(req, res);
			break;
	}
}

export default productVariation;
