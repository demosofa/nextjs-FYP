import { OrderStatus } from '@shared/index';

import models from '@models/index';

class UserController {
	getProfile = async (req, res) => {
		const profile = await models.User.findById(req.user.id).lean();
		if (!profile) return res.status(404).end();
		return res.status(200).json(profile);
	};
	getMyOrder = async (req, res) => {
		let { page, search, status, sort, orderby } = req.query;
		if (!sort) sort = 'status';
		if (!orderby) orderby = -1;
		if (!status) status = { $exists: true };
		let { orders } = await models.Account.findById(req.user.accountId)
			.select('orders')
			.populate({
				path: 'orders',
				populate: [
					{
						path: 'shipper',
						select: 'username'
					},
					'orderItems'
				],
				options: {
					skip: (page - 1) * 10,
					limit: 10,
					sort: {
						[sort]: orderby
					}
				},
				match: {
					status: status
				}
			})
			.lean();
		if (search)
			orders = orders.filter((item) => {
				const check = item.shipper.username
					.toLowerCase()
					.includes(search.toLowerCase());
				return check;
			});
		return res.status(200).json(orders);
	};
	updateProfile = async (req, res) => {
		const profile = await models.User.findById(req.body._id).lean();
		if (!profile) return res.status(404).end();
		const isUpdated = await models.User.findByIdAndUpdate(req.body._id, {
			$set: req.body
		});
		if (!isUpdated) return res.status(404).end();
		return res.status(200).end();
	};
	checkQR = async (req, res) => {
		const { shipperId, id } = req.query;
		if (id === req.body.orderId) {
			const order = await models.Order.findOneAndUpdate(
				{
					_id: id,
					customer: req.user.accountId,
					shipper: shipperId,
					status: OrderStatus.arrived
				},
				{ $set: { status: OrderStatus.validated } }
			);
			if (!order) return res.status(500).json('This is not your order');
			return res.status(200).json(order);
		} else return res.status(500).json('This is not your order');
	};
}

export const user = new UserController();
