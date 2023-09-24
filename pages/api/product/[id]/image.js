import { product } from '@controllers';
import { db } from '@helpers';

async function productImage(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await product.getImage(req, res);
			break;
		case 'put':
			await product.putImage(req, res);
			break;
	}
}

export default productImage;
