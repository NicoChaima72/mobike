const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const moment = require("moment");

const JourneySchema = new Schema({
	user_id: { type: ObjectId },
	start: { type: Date, default: Date.now },
	end: { type: Date },
	price: { type: Number },
	state: { type: Number, default: 0 },
});

JourneySchema.virtual("getDate").get(function () {
	return moment(this.start).format("DD-MM-YY HH:mm");
});

JourneySchema.plugin(mongooseLeanVirtuals);

module.exports = mongoose.model("Journey", JourneySchema);
