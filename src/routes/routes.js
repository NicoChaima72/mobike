const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Card = require("../models/Card");
const Journey = require("../models/Journey");
const { isAuthenticated, isUser } = require("../middlewares/auth");

router.get("/", [isAuthenticated, isUser], async (req, res) => {
	const journeyPending = await Journey.find({
		user_id: req.user._id,
		end: null,
	});
	const card = await Card.find({
		user_id: req.user._id,
		default: true,
	}).lean({ virtuals: true });
	res.render("pages/home.html", {
		title: "Inicio",
		route: "pages.home",
		user_card: card.length > 0 ? card[0] : null,
		journey_pending: journeyPending.length > 0 ? journeyPending[0] : null,
	});
});

router.post("/journey", [isAuthenticated, isUser], async (req, res) => {
	await Journey.create({ user_id: req.user._id });
	res.json({ ok: true });
});

router.post("/journey/end", [isAuthenticated, isUser], async (req, res) => {
	const journey = await Journey.findOne({
		user_id: req.user._id,
		end: { $exists: false },
	});
	if (!journey) return res.json({ ok: false });

	const dateStart = new Date(journey.start);
	const end = Date.now();
	const dateEnd = new Date(end);
	let seconds = Math.trunc(Math.abs(dateEnd - dateStart) / 1000);
	let minutes = Math.trunc(seconds / 60);

	const price = minutes === 0 ? 200 : minutes * 200;

	await journey.updateOne({ state: 1, end, price });

	res.json({ ok: true, price, minutes, seconds: seconds % 60 });
});

router.post(
	"/journey/:journey_id",
	[isAuthenticated, isUser],
	async (req, res) => {
		const journey = await Journey.findById(req.params.journey_id);
		const dateStart = new Date(journey.start);
		let seconds = Math.trunc(Math.abs(Date.now() - dateStart) / 1000);
		let minutes = Math.trunc(seconds / 60);
		res.json({ ok: true, ...journey, seconds: seconds % 60, minutes });
	}
);

module.exports = router;
