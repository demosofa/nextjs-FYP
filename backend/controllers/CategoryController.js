import models from '@models/index';

class CategoryController {
	getAll = async (req, res) => {
		const categories = await models.Category.find()
			.select(['-createdAt', '-updatedAt'])
			.lean();
		if (!categories) return res.status(500).json('Fail to load all categories');
		return res.status(200).json(categories);
	};
	getSubCategories = async (req, res) => {
		const { subCategories } = await models.Category.findById(req.query.id)
			.select('subCategories')
			.populate({ path: 'subCategories', options: { sort: { updatedAt: -1 } } })
			.lean();
		return res.status(200).json(subCategories);
	};
	getCategoriesAreFirstLevel = async (req, res) => {
		const categories = await models.Category.find({
			isFirstLevel: true
		}).lean();
		return res.status(200).json(categories);
	};
	create = async (req, res) => {
		const Category = await models.Category.findOne({
			isFirstLevel: true,
			name: req.body.name
		}).lean();
		if (Category)
			return res.status(300).json({
				message: 'there is already an existed category'
			});
		const created = await models.Category.create(req.body);
		if (!created)
			return res.status(500).json({ message: 'there is error in server' });
		return res.status(200).json(created);
	};
	addSubCategory = async (req, res) => {
		const check = await models.Category.findOne({
			name: req.body.name
		}).lean();
		if (check)
			return res
				.status(500)
				.json('there is already existed category with this name');
		const category = await models.Category.create(req.body);
		const parentCategory = await models.Category.findByIdAndUpdate(
			req.query.id,
			{
				$push: { subCategories: category._id }
			}
		);
		if (!parentCategory)
			return res
				.status(500)
				.json('Fail to update category with addition of sub category');
		return res.status(200).json(category);
	};
	update = async (req, res) => {
		const Category = await models.Category.findOne({
			name: req.body.name,
			isFirstLevel: true
		}).lean();
		if (Category)
			return res.status(300).json({
				message: 'there is already existed category'
			});
		const updated = await models.Category.findByIdAndUpdate(req.query.id, {
			$set: req.body
		});
		if (!updated)
			return res.status(500).json({ message: 'there is error in server' });
		return res.status(200).json(updated);
	};
	delete = async (req, res) => {
		const countedExist = await models.Product.countDocuments({
			categories: req.query.id
		}).lean();
		if (countedExist)
			return res.status(500).json('There is product having this category');
		const deleted = await models.Category.findByIdAndDelete(req.query.id);
		if (!deleted) return res.status(500).send('<p>fail<p>');
		return res.status(200).end();
	};
}

export const category = new CategoryController();
