const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const CardSchema = new Schema({
	user_id: { type: ObjectId },
	type: { type: String, required: true },
	name: { type: String, required: true },
	number: { type: String, required: true },
	expire: { type: String, required: true },
	cvc: { type: String, required: true },
	default: { type: Boolean, default: true },
	date: { type: Date, default: Date.now },
});

CardSchema.virtual("getNumber").get(function () {
	let number = this.number;
	let lastNumbers = number.substring(number.lastIndexOf(" "));
	number = number.substring(0, number.lastIndexOf(" "));
	number = number.replace(/[0-9]/g, "*");
	number = number + lastNumbers;
	return number;
});

CardSchema.plugin(mongooseLeanVirtuals);

module.exports = mongoose.model("Card", CardSchema);
