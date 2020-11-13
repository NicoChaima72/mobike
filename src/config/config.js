process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let urlDB;
if (process.env.NODE_ENV === "dev") {
	urlDB = "mongodb://127.0.0.1:27017/mobike";
} else {
	urlDB = process.env.MONGO_URL;
}
process.env.MONGO_URL = urlDB;

process.env.SESSION_SECRET = process.env.SESSION_SECRET || "cadenasecreta";
