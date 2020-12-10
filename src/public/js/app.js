const currentPage = document.getElementById("current-page")
	? document.getElementById("current-page").value
	: null;

if (currentPage === "home") {
	let intervalJourney;

	verifyCurrentJourney();

	async function verifyCurrentJourney() {
		const currentJourney = document.getElementById("current-journey");
		if (!currentJourney) return null;

		const journeyId = currentJourney.value;
		const journey = await axios.post(`/journey/${journeyId}`);
		timeJourney(journey.data.minutes, journey.data.seconds);
	}

	const btnBikes = document.querySelectorAll(".btn-bike");
	btnBikes.forEach((btnBike) => {
		btnBike.addEventListener("click", () => {
			const direction = btnBike.getAttribute("data-title");

			document.getElementById("title-information").textContent = direction;
			document
				.getElementById("container-information")
				.classList.remove("hidden");
		});
	});

	document.getElementById("close-information").addEventListener("click", () => {
		document.getElementById("container-information").classList.add("hidden");
	});

	document.getElementById("btn-camera").addEventListener("click", () => {
		document.getElementById("container-lease").classList.remove("hidden");
	});

	document.getElementById("close-lease").addEventListener("click", () => {
		document.getElementById("container-lease").classList.add("hidden");
	});

	document.getElementById("btn-lease").addEventListener("click", async () => {
		const journey = await axios.post("/journey");
		console.log(journey);

		timeJourney(0, 1);
	});

	document.getElementById("close-journey").addEventListener("click", () => {
		document.getElementById("container-journey").classList.add("hidden");
	});

	document.getElementById("end-journey").addEventListener("click", async () => {
		let endJourney = await axios.post("/journey/end");
		endJourney = endJourney.data;
		document.getElementById("stat-price").textContent = formatNumber(
			endJourney.price
		);

		const time =
			endJourney.minutes +
			":" +
			(endJourney.seconds.toString().length === 1
				? "0" + endJourney.seconds
				: endJourney.seconds);

		document.getElementById("stat-time").textContent = time;

		clearInterval(intervalJourney);
		document.getElementById("container-journey").classList.add("hidden");
		document.getElementById("container-resumen").classList.add("hidden");
		document.getElementById("container-stats").classList.remove("hidden");
		document.getElementById("btn-camera").classList.remove("hidden");
	});

	document.getElementById("container-resumen").addEventListener("click", () => {
		document.getElementById("container-journey").classList.remove("hidden");
	});

	document.getElementById("close-stats").addEventListener("click", () => {
		document.getElementById("container-stats").classList.add("hidden");
	});

	document.getElementById("end-stats").addEventListener("click", () => {
		document.getElementById("container-stats").classList.add("hidden");
	});

	const timeJourney = (minutes, seconds) => {
		intervalJourney = setInterval(() => {
			if (seconds >= 60) {
				minutes = (seconds % 60) + minutes;
				seconds = 0;
			}

			seconds = seconds.toString();
			if (seconds.length === 1) seconds = `0${seconds}`;

			document.getElementById("seconds-journey").textContent = seconds;
			document.getElementById("minutes-journey").textContent = minutes;
			document.getElementById("seconds-resumen").textContent = seconds;
			document.getElementById("minutes-resumen").textContent = minutes;
			seconds++;
		}, 1000);
		document.getElementById("container-lease").classList.add("hidden");
		document.getElementById("container-journey").classList.remove("hidden");
		document.getElementById("container-resumen").classList.remove("hidden");
		document.getElementById("btn-camera").classList.add("hidden");
	};
}

if (currentPage === "cards") {
	const cardNumber = document.getElementById("card-number");

	function onkeyPress(event) {
		cardNumber.value = cardNumber.value.replace(/[a-zA-Z]/g, "");
	}
	cardNumber.addEventListener("keyup", onkeyPress);

	cardNumber.addEventListener("keyup", () => {
		if (cardNumber.classList.contains("mastercard")) {
			document.getElementById("card-type").textContent = "(mastercard)";
			document.getElementById("type").value = "mastercard";
		}
		if (cardNumber.classList.contains("visa")) {
			document.getElementById("card-type").textContent = "(visa)";
			document.getElementById("type").value = "visa";
		}
		if (cardNumber.classList.contains("unknown")) {
			document.getElementById("card-type").textContent = "";
		}
	});

	var J = Payment.J,
		number = document.querySelector(".cc-number"),
		exp = document.querySelector(".cc-exp"),
		cvc = document.querySelector(".cc-cvc"),
		validation = document.querySelector(".validation");

	Payment.formatCardNumber(number);
	Payment.formatCardExpiry(exp);
	Payment.formatCardCVC(cvc);

	document.querySelector("form").onsubmit = function (e) {
		J.toggleClass(document.querySelectorAll("input"), "invalid");
		J.removeClass(validation, "passed failed");

		var cardType = Payment.fns.cardType(J.val(number));

		J.toggleClass(
			number,
			"invalid",
			!Payment.fns.validateCardNumber(J.val(number))
		);
		J.toggleClass(
			exp,
			"invalid",
			!Payment.fns.validateCardExpiry(Payment.cardExpiryVal(exp))
		);

		J.toggleClass(
			cvc,
			"invalid",
			!Payment.fns.validateCardCVC(J.val(cvc), cardType)
		);

		if (document.querySelectorAll(".invalid").length) {
			e.preventDefault();
			J.addClass(validation, "failed");
		} else {
			J.addClass(validation, "passed");
		}
	};
}

function formatNumber(num) {
	if (!num || num == "NaN") return "-";
	if (num == "Infinity") return "&#x221e;";
	num = num.toString().replace(/\$|\,/g, "");
	if (isNaN(num)) num = "0";
	sign = num == (num = Math.abs(num));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10) cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num =
			num.substring(0, num.length - (4 * i + 3)) +
			"." +
			num.substring(num.length - (4 * i + 3));
	return (sign ? "" : "-") + num;
}
