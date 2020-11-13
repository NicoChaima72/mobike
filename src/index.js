const express = require("express");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const flash = require("connect-flash");

// initializations
const app = express();
require("./config/config");
require("./config/passport");
require("./database");

// settings
app.set("port", process.env.PORT);
app.set("views", path.join(__dirname, "views"));
app.engine("html", ejs.renderFile);
app.set("view engine", "ejs");

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
	session({
		cookie: { maxAge: 86400000 },
		store: new MemoryStore({ checkPeriod: 86400000 }),
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// global variables
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	res.locals.success_msg = req.flash("success_msg") || null;
	res.locals.error_msg = req.flash("error_msg") || null;
	res.locals.error = req.flash("error") || null;
	res.locals.data = req.flash("data");
	res.locals.data.length > 0 ? (res.locals.data = res.locals.data[0]) : null;
	next();
});

// routes
app.use(require("./routes/routes"));
app.use(require("./routes/users"));
app.use(require("./routes/auth"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// listen server
app.listen(app.get("port"), () => {
	console.log("Server run in port 3000");
});
