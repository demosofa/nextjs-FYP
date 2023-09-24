import { comment } from '@controllers';
import { authenticate, db } from '@helpers';

export default async function productComment(req, res) {
	await db.connect();
	switch (req.method.toLowerCase()) {
		case 'get':
			await comment.getCommentFromProduct(req, res);
			break;
		case 'post':
			await authenticate(comment.addCommentToProduct)(req, res);
			break;
	}
}
