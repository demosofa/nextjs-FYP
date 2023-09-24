import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const VariantOption = new Schema({
	name: { type: String, required: true }
});

export default mongoose.models.VariantOption ||
	mongoose.model('VariantOption', VariantOption);
