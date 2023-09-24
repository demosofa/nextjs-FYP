import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const File = new Schema(
	{
		name: { type: String, required: true },
		public_id: { type: String, required: true, unique: true },
		format: { type: String },
		type: { type: String, required: true },
		url: { type: String, required: true },
		size: { type: Number, required: true }
	},
	{ timestamps: true }
);

File.post(
	'findOneAndDelete',
	{ document: false, query: true },
	async function (doc) {
		await mongoose.models.Product.updateOne(
			{ images: doc._id },
			{
				$pull: {
					images: doc._id
				}
			}
		);
		await mongoose.models.Variation.updateOne(
			{ image: doc._id },
			{
				$unset: {
					image: 1
				}
			}
		);
	}
);

export default mongoose.models.File || mongoose.model('File', File);
