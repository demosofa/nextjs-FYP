import { category } from '@controllers';
import { db } from '@helpers';

export default async function categoryAll(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await category.getAll(req, res);
			break;
	}
}
