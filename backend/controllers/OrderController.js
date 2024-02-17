import { toDataURL } from 'qrcode';

import { OrderStatus } from '@shared/index';

import models from '@models/index';

class OrderController {
	getOrder = async (req, res) => {
		const order = await models.Order.findById(req.query.id)
			.populate({
				path: 'customer',
				select: ['username']
			})
			.populate({
				path: 'shipper',
				select: ['username']
			})
			.lean();
		if (!order) return res.status(500).json('Fail to get order');
		return res.status(200).json(order);
	};
	lstOrder = async (req, res) => {
		let { page, sort, limit, orderby } = req.query;
		if (!sort) sort = 'customer.username';
		if (!orderby) orderby = -1;
		if (!limit) limit = 10;
		const lstOrder = await models.Order.find({
			status: OrderStatus.pending,
			customer: { $ne: req.user.accountId }
		})
			.skip((page - 1) * limit)
			.limit(limit)
			.populate({
				path: 'customer',
				select: ['username']
			})
			.sort({
				[sort]: parseInt(orderby)
			})
			.lean();
		const orderCounted = await models.Order.countDocuments({
			status: OrderStatus.pending
		}).lean();
		const pageCounted = Math.ceil(orderCounted / limit);
		return res.status(200).json({ lstOrder, pageCounted });
	};
	getQR = async (req, res) => {
		const url = `${req.query.id}/${req.user.accountId}`;
		try {
			const generatedQR = await toDataURL(url);
			return res.status(200).json(generatedQR);
		} catch (error) {
			return res.status(500).json('Fail to get QR');
		}
	};
	addOrder = async (req, res) => {
		const { products, ...others } = req.body;
		const orderItems = await Promise.all(
			products.map(async (product) => {
				const reduce = parseInt(`-${product.quantity}`);
				await models.Variation.findByIdAndUpdate(product.variationId, {
					$inc: { quantity: reduce }
				});
				return models.OrderItem.create(product);
			})
		);
		const created = await models.Order.create({
			...others,
			customer: req.user.accountId,
			orderItems: orderItems.map((item) => item._id)
		});
		if (!created) return res.status(500).json('Fail to create Order');
		const addOrderToCustomer = await models.Account.findByIdAndUpdate(
			req.user.accountId,
			{
				$push: { orders: created._id }
			}
		);
		if (!addOrderToCustomer) return res.status(500).json('Fail to add Order');
		return res.status(200).end();
	};
	patchOrder = async (req, res) => {
		await models.Order.findByIdAndUpdate(req.query.id, {
			$set: req.body
		});
		return res.status(200).end();
	};
	cancelOrder = async (req, res) => {
		await models.Order.findByIdAndUpdate(req.query.id, {
			$set: { status: 'cancel' }
		})
			.select('orderItems')
			.populate('orderItems')
			.then(({ orderItems }) =>
				Promise.all(
					orderItems.map(async ({ variationId, quantity }) => {
						return models.Variation.findByIdAndUpdate(variationId, {
							$inc: { quantity }
						});
					})
				)
			);
		return res.status(200).end();
	};
}

export const order = new OrderController();
