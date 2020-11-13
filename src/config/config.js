process.env.PORT = process.env.PORT || 3000;

process.env.MONGO_URL =
	process.env.MONGO_URL || "mongodb://127.0.0.1:27017/mobike";

process.env.SESSION_SECRET = process.env.SESSION_SECRET || "cadenasecreta";
