import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Rate = new Schema({
	account: { type: Schema.Types.ObjectId, ref: 'Account' },
	product: { type: Schema.Types.ObjectId, ref: 'Product' },
	rating: { type: Number }
});

export default mongoose.models.Rate || mongoose.model('Rate', Rate);
