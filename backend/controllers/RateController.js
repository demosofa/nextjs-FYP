import models from '@models/index';

class RateController {
	getRating = async (req, res) => {
		try {
			const { ratings } = await models.Account.findById(req.user.accountId)
				.populate({
					path: 'ratings',
					match: {
						product: req.query.id
					},
					select: 'rating'
				})
				.lean();
			return res.status(200).json(ratings[0]);
		} catch (error) {
			return res.status(500).json({ message: error });
		}
	};
	ratingProduct = async (req, res) => {
		const productId = req.query.id;
		const { accountId } = req.user;
		let increment = 0,
			count = 0;
		try {
			const prevRate = await models.Rate.findOne({
				product: productId,
				account: accountId
			}).lean();

			const update = await models.Rate.findOneAndUpdate(
				{ product: productId, account: accountId },
				{ ...req.body, product: productId, account: accountId },
				{
					upsert: true,
					new: true
				}
			);
			if (prevRate) increment = update.rating - prevRate.rating;
			else {
				await models.Account.findByIdAndUpdate(accountId, {
					$push: { ratings: update._id }
				});
				increment = update.rating;
				count = 1;
			}
			models.Product.findById(productId)
				.select(['avgRating', 'rateCount'])
				.exec(async (err, doc) => {
					await models.Product.findByIdAndUpdate(productId, {
						$inc: {
							rateCount: count
						},
						avgRating:
							(doc.avgRating * doc.rateCount + increment) /
							(doc.rateCount + count)
					});
				});
			return res.status(200).end();
		} catch (error) {
			return res.status(500).json({ message: error });
		}
	};
}

export const rate = new RateController();
