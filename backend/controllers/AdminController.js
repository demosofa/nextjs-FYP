import { OrderStatus, Role } from '@shared/index';
import models from '@models/index';

class AdminController {
	getAllOrder = async (req, res) => {
		try {
			let { search, page, sort, status, limit, orderby } = req.query;
			let filterOptions = {};
			if (!sort) sort = '_id';
			if (!orderby) orderby = -1;
			if (search)
				filterOptions = {
					...filterOptions,
					$or: [
						{ $expr: { $gt: [{ $indexOfCP: ['$customer', search] }, -1] } },
						{ $expr: { $gt: [{ $indexOfCP: ['$shipper', search] }, -1] } }
					]
				};
			if (status)
				filterOptions = {
					...filterOptions,
					status
				};
			if (!limit) limit = 10;
			if (!page) page = 1;
			const orders = await models.Order.aggregate()
				.project({
					customer: 1,
					shipper: 1,
					status: 1,
					orderItems: 1,
					quantity: 1,
					shippingFee: 1,
					total: 1,
					updatedAt: 1
				})
				.lookup({
					from: 'accounts',
					localField: 'customer',
					foreignField: '_id',
					pipeline: [
						{
							$project: {
								username: 1
							}
						}
					],
					as: 'customer'
				})
				.lookup({
					from: 'accounts',
					localField: 'shipper',
					foreignField: '_id',
					pipeline: [
						{
							$project: {
								username: 1
							}
						}
					],
					as: 'shipper'
				})
				.unwind('customer')
				.unwind('shipper')
				.addFields({
					customer: '$customer.username',
					shipper: '$shipper.username'
				})
				.match(filterOptions)
				.sort({ [sort]: orderby })
				.lookup({
					from: 'orderItems',
					localField: 'orderItems',
					foreignField: '_id',
					as: 'orderItems'
				})
				.facet({
					orders: [{ $skip: (page - 1) * limit }, { $limit: limit }],
					pageCounted: [
						{
							$count: 'count'
						},
						{
							$project: {
								count: {
									$ceil: {
										$divide: ['$count', limit]
									}
								}
							}
						}
					]
				});
			return res.status(200).json(...orders);
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	};

	changeOrderStatus = async (req, res) => {
		const { status } = req.body;
		await models.Order.findByIdAndUpdate(req.query.id, { $set: { status } });
		return res.status(200).end();
	};

	deleteOrder = async (req, res) => {
		try {
			const deleted = await models.Order.deleteOne({
				_id: req.body.Id,
				status: {
					$in: [
						OrderStatus.progress,
						OrderStatus.pending,
						OrderStatus.cancel,
						OrderStatus.paid
					]
				}
			});
			if (!deleted.deletedCount) throw new Error('Fail to delete Order');
			return res.status(200).end();
		} catch (error) {
			return res.status(500).json(error.message);
		}
	};

	getAllProfile = async (req, res) => {
		try {
			let { search, page, sort, role, limit, orderby } = req.query;
			let filterOptions = { role: { $ne: Role.admin } };
			if (!orderby) orderby = -1;
			if (search)
				filterOptions = {
					...filterOptions,
					$text: { $search: search }
				};
			if (role)
				filterOptions = {
					...filterOptions,
					role
				};
			if (!limit) limit = 10;
			if (!page) page = 1;
			const lstProfile = await models.Account.find(filterOptions)
				.skip((page - 1) * limit)
				.limit(limit)
				.sort({
					[sort]: orderby
				})
				.populate({ path: 'user', select: ['email', 'phoneNumber'] })
				.lean();
			if (!lstProfile) throw new Error('Fail to load profiles');
			const countProfiles = await models.Account.countDocuments(
				filterOptions
			).lean();
			const pageCounted = Math.ceil(countProfiles / limit);
			return res.status(200).json({ lstProfile, pageCounted });
		} catch (error) {
			return res.status(500).json({ message: error });
		}
	};

	changeRole = async (req, res) => {
		try {
			await models.Account.findByIdAndUpdate(req.query.id, {
				$set: { role: req.body.role }
			});
			return res.status(200).end();
		} catch (error) {
			return res.status(500).json({ message: error });
		}
	};

	blockOrUnblockAccount = async (req, res) => {
		try {
			await models.Account.findByIdAndUpdate(req.query.id, {
				$set: { blocked: req.body.blocked }
			});
			return res.status(200).end();
		} catch (error) {
			return res.status(500).json({ message: error });
		}
	};

	deleteAccount = async (req, res) => {
		try {
			await models.Account.findByIdAndDelete(req.query.id);
			return res.status(200).end();
		} catch (error) {
			return res.status(500).json({ message: error });
		}
	};

	income = async (req, res) => {
		const previousMonth = new Date(
			new Date().setMonth(new Date().getMonth() - 2)
		);
		try {
			const income = await models.Order.aggregate()
				.match({ createdAt: { $gte: previousMonth } })
				.project({
					month: { $month: '$createdAt' },
					sales: '$quantity'
				})
				.group({
					_id: '$month',
					total: { $sum: '$sales' }
				})
				.sort({ _id: 1 });
			res.status(200).json(income);
		} catch (error) {
			res.status(500).json(error);
		}
	};

	profit = async (req, res) => {
		const previousMonth = new Date(
			new Date().setMonth(new Date().getMonth() - 2)
		);
		try {
			const profit = await models.Order.aggregate()
				.match({ updatedAt: { $gte: previousMonth }, status: OrderStatus.paid })
				.project({
					month: { $month: '$createdAt' },
					profit: '$total'
				})
				.group({ _id: '$month', total: { $sum: '$profit' } })
				.sort({ _id: 1 });
			return res.status(200).json(profit);
		} catch (error) {
			return res.status(500).json(error);
		}
	};

	newUsers = async (req, res) => {
		const previousMonth = new Date(
			new Date().setMonth(new Date().getMonth() - 2)
		);
		try {
			const accounts = await models.Account.aggregate()
				.match({ role: Role.customer, createdAt: { $gte: previousMonth } })
				.project({
					month: { $month: '$createdAt' }
				})
				.group({ _id: '$month', total: { $sum: 1 } })
				.sort({ _id: 1 });
			return res.status(200).json(accounts);
		} catch (error) {
			return res.status(500).json(error);
		}
	};

	totalOrder = async (req, res) => {
		const previousMonth = new Date(
			new Date().setMonth(new Date().getMonth() - 2)
		);
		try {
			const orders = await models.Order.aggregate()
				.match({ createdAt: { $gte: previousMonth } })
				.project({
					month: { $month: '$createdAt' }
				})
				.group({ _id: '$month', total: { $sum: 1 } })
				.sort({ _id: 1 });
			return res.status(200).json(orders);
		} catch (error) {
			return res.status(500).json(error);
		}
	};

	topSold = async (req, res) => {
		const previousMonth = new Date(
			new Date().setMonth(new Date().getMonth() - 2)
		);
		try {
			const total = await models.OrderItem.aggregate([
				{ $match: { createdAt: { $gte: previousMonth } } },
				{
					$project: {
						productId: 1,
						title: 1,
						image: 1,
						sales: '$quantity'
					}
				},
				{
					$group: {
						_id: '$productId',
						image: { $last: '$image' },
						title: { $last: '$title' },
						total: { $sum: '$sales' }
					}
				},
				{
					$sort: {
						total: -1
					}
				}
			]).limit(10);
			return res.status(200).json(total);
		} catch (error) {
			return res.status(500).json(error);
		}
	};
}

export default new AdminController();
