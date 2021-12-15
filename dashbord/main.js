import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

let userData;

const realTime = {
	isHappyHour: false, //When this is true the bar has happyhour
	isLastCall: false, //When this is true the bar has last call
	isOpen: false, //When this is true the bar is open
	isSimulation: false, //When this is true the bar does not automaticaly calculate the time as real time and can be simulated
	stateParam: "",
};

function init() {
	checkURLParameters();

	if (!realTime.isSimulation) {
		calculateTime();
	}

	if (realTime.isOpen) {
		getData();
	}

	//call clock function every second
	setInterval(setDate, 1000);
	//hide login popup section
	document.querySelector("#login-section").classList.add("hide");
	//listen for click on "GO TO DASHBOARD" button
	document.querySelector("#dashboard-button").addEventListener("click", () => {
		if (localStorage.login) {
			window.location.href = `dashboard.html?state=${realTime.stateParam}`;
		} else {
			clickLogin();
		}
	});
}

function checkURLParameters() {
	const queryString = window.location.search;

	const urlParams = new URLSearchParams(queryString);

	const state = urlParams.get("state");
	if (state) {
		if (state === "happyhour") {
			realTime.isHappyHour = true;
			realTime.isOpen = true;
			realTime.isSimulation = true;
			realTime.stateParam = "happyhour";
		} else if (state === "lastcall") {
			realTime.isLastCall = true;
			realTime.isOpen = true;
			realTime.isSimulation = true;
			realTime.stateParam = "lastcall";
		} else if (state === "open") {
			realTime.isOpen = true;
			realTime.isSimulation = true;
			realTime.stateParam = "open";
		} else if (state === "closed") {
			realTime.isOpen = false;
			realTime.isSimulation = true;
			realTime.stateParam = "closed";
		}
	}
}

function calculateTime() {
	//get current date and time
	const now = new Date();

	//get current minutes and hour
	const hours = now.getHours();
	const minuts = now.getMinutes();

	console.log("hours", hours);

	if (hours == 20) {
		realTime.isHappyHour = true;
	}

	if (hours >= 12 && hours <= 22) {
		realTime.isOpen = true;
	}

	if (hours == 21 && minuts >= 30) {
		realTime.isLastCall = true;
	}
}

async function getData() {
	const data = await fetchfunction("https://groupfoobar.herokuapp.com/");
	userData = await fetchfunction("users.json");
	const beertypeData = await fetchfunction("https://groupfoobar.herokuapp.com/beertypes");

	console.log("data", data);
	console.log("Beer data", beertypeData);
	console.log("users", userData);

	showQueue(data);
	showServing(data);
	showBeer(data, beertypeData);

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

	let seconds;
	let minutes;
	let hours;

	if (realTime.isSimulation && realTime.isHappyHour) {
		//Ony minuts and secons will count, the hour will start over
		seconds = now.getSeconds();
		minutes = now.getMinutes();
		hours = "20";
	} else if (realTime.isSimulation && realTime.isLastCall) {
		//Only seconds will count
		seconds = now.getSeconds();
		minutes = "30";
		hours = "21";
	} else if (realTime.isSimulation && realTime.isOpen) {
		//Ony minuts and secons will count, the hour will start over
		seconds = now.getSeconds();
		minutes = now.getMinutes();
		hours = "12";
	} else {
		//get current seconds, minutes and hour
		seconds = now.getSeconds();
		minutes = now.getMinutes();
		hours = now.getHours();
	}

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
	if (realTime.isHappyHour) {
		document.querySelector(".clock-event").textContent = "Happy hour";
		document.querySelector(".clock-base").classList.add("happyhour");
	}

	//if clock is 21.30 or above
	if (realTime.isLastCall) {
		//write last call dashboard by the clock
		document.querySelector(".clock-event").textContent = "Last call";
		document.querySelector(".clock-base").classList.add("lastcall");
	}

	//if clock is 22.00 or above
	if (!realTime.isOpen) {
		//write closed on dashboard
		document.querySelector(".clock-event").textContent = "closed";
	}
}

//show beer taps
function showBeer(data, beertype) {
	document.querySelector("#taps").innerHTML = "";

	//show all beers
	beertype.forEach((beertype) => {
		const clone = document.querySelector("template.tap").content.cloneNode(true);

		//clone.querySelector("img").src = `assets/${beertype.name}.svg`;
		clone.querySelector("img").src = new URL(`./assets/${beertype.name}.svg`, import.meta.url).href;
		clone.querySelector("img").setAttribute("width", "20px");
		clone.querySelector("img").setAttribute("height", "100px");
		clone.querySelector("p").textContent = beertype.name;

		//if beer is on tap then remove opacity
		data.taps.forEach((tap) => {
			if (tap.beer === beertype.name) {
				clone.querySelector("img").classList.add("showbeer");
				clone.querySelector("p").classList.add("showbeername");
			}
		});

		document.querySelector("#taps").appendChild(clone);
	});
}

//open login popup
function clickLogin() {
	//show popup and add styling to background
	document.querySelector("#login-section").classList.remove("hide");
	document.querySelector("#main-container").classList.add("popup-blur");

	//call login function
	login();

	//toggle password visibility
	document.querySelector("#password-toggle").addEventListener("click", () => {
		//document.querySelector("#password-toggle").src = "../assets/eye-02.svg";
		document.querySelector("#password-toggle").src = new URL(`./assets/eye-02.svg`, import.meta.url).href;
		const password = document.querySelector("#password");
		//if password is hidden
		if (password.getAttribute("type") === "password") {
			//show password
			password.setAttribute("type", "text");
		} else {
			//hide password if not hidden
			password.setAttribute("type", "password");
			//document.querySelector("#password-toggle").src = "../assets/eye-01.svg";
			document.querySelector("#password-toggle").src = new URL(`./assets/eye-01.svg`, import.meta.url).href;
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

function login() {
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
		let userName;

		//check if user and password exist and match
		userData.forEach((user) => {
			if (user.username === usernameInput && user.password === passwordInput) {
				//if password and user match set variabel to be true
				userCorrect = true;
				userName = user.username;
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
			window.localStorage.setItem("login", userName);
			//go to manager and worker dashboard
			window.location.href = `dashboard.html?state=${realTime.stateParam}`;
		}
	});
}
