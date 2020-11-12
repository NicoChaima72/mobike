require("./config/config");

const mongoose = require("mongoose");

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then((db) => console.log("BD Connected"))
	.catch((err) => console.log(err));
