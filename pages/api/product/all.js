import { product } from '@controllers';
import { db } from '@helpers';

export default async function productAll(req, res) {
	await db.connect();
	await product.getAll(req, res);
}
