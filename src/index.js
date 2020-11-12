const express = require("express");

// initializations
const app = express();
require("./config/config");
require("./database");

// middlewares
app.use(express.urlencoded({ extended: false }));

// settings

// global variables

// routes
app.get("/", (req, res) => {
	res.json({ ok: true });
});

app.use(require("./routes/routes"));

app.listen(3000, () => {
	console.log("Server run in port 3000");
});
