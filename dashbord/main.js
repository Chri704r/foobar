import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

let userData;

function init() {
	getData();
	loginFunction();
	//call clock function every second
	setInterval(setDate, 1000);
	//hide login popup section
	document.querySelector("#login-section").classList.add("hide");
	//listen for click on "GO TO DASHBOARD" button
	document.querySelector("#dashboard-button").addEventListener("click", clickLogin);
}

//open login popup
function clickLogin() {
	//show popup and add styling to background
	document.querySelector("#login-section").classList.remove("hide");
	document.querySelector("#main-container").classList.add("popup-blur");

	//toggle password visibility
	document.querySelector("#password-toggle").addEventListener("click", () => {
		document.querySelector("#password-toggle").src = "../assets/eye-off.svg";
		const password = document.querySelector("#password");
		//if password is hidden
		if (password.getAttribute("type") === "password") {
			//show password
			password.setAttribute("type", "text");
		} else {
			//hide password if not hidden
			password.setAttribute("type", "password");
			document.querySelector("#password-toggle").src = "../assets/eye.svg";
		}
	});

	//listen for click on close button
	document.querySelector(".close-popup").addEventListener("click", closeLogin);
}

//close login popup
function closeLogin() {
	document.querySelector("#login-section").classList.add("hide");
	document.querySelector("#main-container").classList.remove("popup-blur");
}

async function getData() {
	const data = await fetchfunction("https://groupfoobar.herokuapp.com/");
	userData = await fetchfunction("users.json");

	console.log("data", data);
	console.log("users", userData);

	showQueue(data);
	showServing(data);
	showBeer(data);

	//call getData function every 5 seconds to update the data
	setTimeout(getData, 5000);
}

async function fetchfunction(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

//show beers in queue
function showQueue(data) {
	document.querySelector("#queue-container").innerHTML = "";

	//foreach beer in queue
	data.queue.forEach((order) => {
		const clone = document.querySelector("template.customer-dashboard").content.cloneNode(true);

		//show order ID
		clone.querySelector(".ordernumber").textContent = order.id;

		document.querySelector("#queue-container").appendChild(clone);
	});
}

//show beers that are being served
function showServing(data) {
	document.querySelector("#serving-container").innerHTML = "";

	//for each beer being served
	data.serving.forEach((serve) => {
		const clone = document.querySelector("template.customer-dashboard").content.cloneNode(true);

		//show the order ID
		clone.querySelector(".ordernumber").textContent = serve.id;

		document.querySelector("#serving-container").appendChild(clone);
	});
}

function setDate() {
	//select hour, minutes and seconds and create variables
	const secondHand = document.querySelector(".clock-seconds");
	const minuteHand = document.querySelector(".clock-minute");
	const hourHand = document.querySelector(".clock-hour");

	//get current date and time
	const now = new Date();

	//get current seconds, minutes and hour
	const seconds = now.getSeconds();
	const minutes = now.getMinutes();
	const hours = now.getHours();

	//calculate degrees for seconds, minutes and hours
	const secondsDegrees = (seconds / 60) * 360 + 90;
	//make the hands progressively move with seconds/minutes
	const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6 + 90;
	const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30 + 90;

	//rotate hands to match the hours/minutes/seconds
	secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
	minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
	hourHand.style.transform = `rotate(${hourDegrees}deg)`;

	//show digital clock
	if (minutes < 10 && seconds < 10) {
		document.querySelector(".digital-clock").innerHTML = `${hours}:0${minutes}:0${seconds}`;
	} else if (minutes < 10) {
		document.querySelector(".digital-clock").innerHTML = `${hours}:0${minutes}:${seconds}`;
	} else if (seconds < 10) {
		document.querySelector(".digital-clock").innerHTML = `${hours}:${minutes}:0${seconds}`;
	} else {
		document.querySelector(".digital-clock").innerHTML = `${hours}:${minutes}:${seconds}`;
	}

	//change style if happy hour or last call
	if (hours === 20) {
		document.querySelector(".clock-event").textContent = "Happy hour";
		document.querySelector(".clock-base").classList.add("happyhour");
	}

	//if clock is 21.30 or above
	if (hours === 21 && minutes >= 30) {
		//write last call dashboard by the clock
		document.querySelector(".clock-event").textContent = "Last call";
		document.querySelector(".clock-base").classList.add("lastcall");
	}

	//if clock is 22.00 or above
	if (hours >= 22) {
		//write closed on dashboard
		document.querySelector(".clock-event").textContent = "closed";
	}
}

//show beer taps
function showBeer(data) {
	document.querySelector("#taps").innerHTML = "";

	//foreach beer show img and name
	data.taps.forEach((beer) => {
		const clone = document.querySelector("template.tap").content.cloneNode(true);

		clone.querySelector("img").src = `assets/${beer.beer}.svg`;
		clone.querySelector("p").textContent = beer.beer;

		document.querySelector("#taps").appendChild(clone);
	});
}

function loginFunction() {
	let usernameInput;
	let passwordInput;

	//eventlistener for username input field
	document.querySelector("#login-section input[type=text]").addEventListener("input", () => {
		usernameInput = document.querySelector("#login-section input[type=text]").value;
	});
	//eventlistener for password input field
	document.querySelector("#password").addEventListener("input", () => {
		passwordInput = document.querySelector("#password").value;
	});

	//listen for click on login button
	document.querySelector("#login-button").addEventListener("click", (e) => {
		//prevent form from sumbitting
		e.preventDefault();

		let userCorrect = false;

		//check if user and password exist and match
		userData.forEach((user) => {
			if (user.username === usernameInput && user.password === passwordInput) {
				//if password and user match set variabel to be true
				userCorrect = true;
			}
		});

		//if user and password doesnt match
		if (!userCorrect) {
			//alert with invalid message
			document.querySelector(".invalid-input").textContent = "Username or password is not correct";

			//and clear the invalid message when yu start typing in input field
			document.querySelectorAll("input").forEach((inputfield) => {
				inputfield.addEventListener("input", () => {
					document.querySelector(".invalid-input").textContent = "";
				});
			});
		} else {
			//go to manager and worker dashboard
			window.location.href = "dashboard.html";
		}
	});
}
