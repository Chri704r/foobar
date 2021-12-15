import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

const realTime = {
	isHappyHour: false, //When this is true the bar has happyhour
	isLastCall: false,
	isOpen: false, //When this is true the bar is open
	isSimulation: false, //When this is true the bar does not automaticaly calculate the time as real time and can be simulated
	stateParam: "", //Saves the parameter
};

const calendarData = {
	monthArray: ["January", "Febuary", "Martch", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	currentMonth: "",
	currentYear: "",
	currentDay: "",
};

const queueArray = [];

let barData;

const beer = {
	beerArray: [],
	lastCount: 0,
	newCount: 0,
};

const workstatus = {
	waiting: "Waiting",
	pourBeer: "Pouring beer",
	replaceKeg: "Replacing keg",
	releaseTap: "Releasing tap",
	reserveTap: "Reserving tap",
	startServing: "Starting to serve",
	receivePayment: "Receiving payment",
};

const beerSold = {
	Peter: {
		sold: 0,
		custServed: 0,
		income: 0,
	},
	Klaus: {
		sold: 0,
		custServed: 0,
		income: 0,
	},
	Jonas: {
		sold: 0,
		custServed: 0,
		income: 0,
	},
	Dannie: {
		sold: 0,
		custServed: 0,
		income: 0,
	},
	custumersServed: [],
};

function init() {
	checkURLParameters();

	if (!realTime.isSimulation) {
		calculateTime();
	}

	if (realTime.isOpen) {
		getData();
	} else {
		getStorage();
	}

	registerButtons();
	claculateCalendar();
	getUserLogin();
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

	//get current hour
	const hours = now.getHours();

	console.log("hours", hours);

	if (hours == 20) {
		realTime.isHappyHour = true;
	}

	if (hours >= 12 && hours <= 22) {
		realTime.isOpen = true;
	}
}

function registerButtons() {
	//Button for opening the burger menu
	document.querySelector(".burger-menu").addEventListener("click", () => {
		document.querySelector(".burger-menu").classList.toggle("change");
		document.querySelector("#dash-nav-mobil").classList.toggle("hide");
	});

	//Button to go to the custumerdashboard
	document.querySelectorAll(".to-cust-dash").forEach((button) => {
		button.addEventListener("click", () => {
			//Loads the page using the state parameters
			window.location.href = `index.html?state=${realTime.stateParam}`;
		});
	});

	//button for signing out on web version
	document.querySelector("#dash-nav-web .logout-button").addEventListener("click", () => {
		localStorage.removeItem("login");
		window.location.href = `index.html?state=${realTime.stateParam}`;
	});

	//button for signing out on mobile version
	document.querySelector("#dash-nav-mobil .logout-button").addEventListener("click", () => {
		localStorage.removeItem("login");
		window.location.href = `index.html?state=${realTime.stateParam}`;
	});

	//Open the popup for the queue
	document.querySelectorAll(".popup-queue").forEach((button) => {
		button.addEventListener("click", () => {
			document.querySelector("#popup-queue").classList.remove("hide");
			document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
		});
	});

	document.querySelector("#dash-queue").addEventListener("click", () => {
		document.querySelector("#popup-queue").classList.remove("hide");
		document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
	});

	//Open the popup for the income
	document.querySelectorAll(".popup-income").forEach((button) => {
		button.addEventListener("click", () => {
			document.querySelector("#popup-income").classList.remove("hide");
			document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
		});
	});

	document.querySelector("#dash-income").addEventListener("click", () => {
		document.querySelector("#popup-income").classList.remove("hide");
		document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
	});

	//Open the popup for the bartenders
	document.querySelectorAll(".popup-bartender").forEach((button) => {
		button.addEventListener("click", () => {
			document.querySelector("#popup-bartenders").classList.remove("hide");
			document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
		});
	});

	document.querySelector("#dash-bartenders").addEventListener("click", () => {
		document.querySelector("#popup-bartenders").classList.remove("hide");
		document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
	});

	//Open the popup for the Beer
	document.querySelectorAll(".popup-beer").forEach((button) => {
		button.addEventListener("click", () => {
			document.querySelector("#popup-beer").classList.remove("hide");
			document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
		});
	});

	document.querySelector("#dash-taps").addEventListener("click", () => {
		document.querySelector("#popup-beer").classList.remove("hide");
		document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
	});

	//Open the popup for the Calendar
	document.querySelectorAll(".popup-calendar").forEach((button) => {
		button.addEventListener("click", () => {
			document.querySelector("#popup-calendar").classList.remove("hide");
			document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
		});
	});

	document.querySelector("#dash-calendar").addEventListener("click", () => {
		document.querySelector("#popup-calendar").classList.remove("hide");
		document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
	});

	//Button for closing/hiding the popup
	document.querySelectorAll(".close-popup").forEach((button) => {
		button.addEventListener("click", () => {
			document.querySelector("#dash-content-wrapper").classList.remove("popup-blur");

			document.querySelectorAll(".pop-article").forEach((article) => {
				article.classList.add("hide");
			});
		});
	});

	//Buttons for the calendar
	document.querySelector("#forward").addEventListener("click", goForward);
	document.querySelector("#back").addEventListener("click", goBack);
}

function getUserLogin() {
	if (localStorage.login) {
		//capitalize first letter in username
		const username = localStorage.login.charAt(0).toUpperCase() + localStorage.login.slice(1);
		//insert username in HTML
		document.querySelector("#user-login").textContent += ` ${username}`;
	}
}

async function getData() {
	const dataUrl = "https://groupfoobar.herokuapp.com/";
	const beerUrl = "https://groupfoobar.herokuapp.com/beertypes";

	const beerData = await fetchfunction(beerUrl);
	console.log("beer", beerData);

	async function dataLoop() {
		const data = await fetchfunction(dataUrl);
		console.log("data", data);
		calculateBartenderStats(data);

		barData = data;

		createBarchart(data);
		displayBartenders(data);
		countBeer(data);
		showBeer(data);

		setTimeout(dataLoop, 5000);
	}

	dataLoop();
}

async function fetchfunction(url) {
	const response = await fetch(url);

	const data = await response.json();
	return data;
}

//Function creating the barchart
function createBarchart(data) {
	//calculating the length of the queue, setting it to 0.1 if it is 0, so the bar is still shown i the chart
	let queue = data.queue.length;
	if (queue === 0) {
		queue = 0.1;
	}

	//If there are 10 items in the array remove the first/oldest
	if (queueArray.length === 10) {
		queueArray.shift();
	}

	//Add the new item to the array
	queueArray.push(queue);

	displayBarchart();
}

function displayBarchart() {
	//For loop displaying the bars
	for (let i = 0; i < queueArray.length; i++) {
		document.querySelector(`#bar-${i + 1}`).style.height = `${queueArray[i] * 2}vh`;
	}

	//To display the chart standing up
	const bars = document.querySelectorAll(".bar.hide");
	bars.forEach((bar) => {
		bar.classList.remove("hide");
	});

	if (window.innerWidth < 1000) {
		for (let i = 0; i < queueArray.length; i++) {
			document.querySelector(`#pop-bar-${i + 1}`).style.width = `${queueArray[i] * 5}vw`;

			if (queueArray[i] >= 1) {
				document.querySelector(`#pop-bar-${i + 1} span`).textContent = queueArray[i];
			}
		}
		//To display the chart lying down
	} else {
		for (let i = 0; i < queueArray.length; i++) {
			document.querySelector(`#pop-bar-${i + 1}`).style.height = `${queueArray[i] * 5}vw`;

			if (queueArray[i] >= 1) {
				document.querySelector(`#pop-bar-${i + 1} span`).textContent = queueArray[i];
			}
		}
	}
}

function displayBartenders(data) {
	//Create clone of the template
	const bartenders = data.bartenders;

	document.querySelectorAll(".bart-display").forEach((display) => {
		display.innerHTML = "";

		bartenders.forEach((bartender) => {
			const clone = document.querySelector("#temp-bartender").content.cloneNode(true);

			if (bartender.usingTap === null) {
				bartender.usingTap = "None";
			}

			//Insert bartender in clone
			clone.querySelector(".bartender_photo").src = `assets/${bartender.name}_edit.png`;
			clone.querySelector(".bartender-name").textContent = bartender.name;
			clone.querySelector(".status").textContent = bartender.status;
			clone.querySelector(".status-detail").textContent = workstatus[bartender.statusDetail];
			clone.querySelector(".using-tap").textContent = "Using tab: " + bartender.usingTap;

			clone.querySelector(".bart-article").setAttribute("class", `bart-${bartender.name}`);

			//Append clone to section
			display.appendChild(clone);

			//If the container is the popup container also display statistics
			if (display === document.querySelector("#pop-bartenders")) {
				displayStatisstics(bartender);
			}
		});
	});
}

function displayStatisstics(bartender) {
	const thisBartender = bartender.name;

	//Clone template
	const clone = document.querySelector("#temp-bart-stats").content.cloneNode(true);

	//Insert in the clone
	clone.querySelector(".cust-number").textContent = beerSold[thisBartender].custServed;
	clone.querySelector(".beer-number").textContent = beerSold[thisBartender].sold;
	clone.querySelector(".inc-number").textContent = beerSold[thisBartender].income;

	//Append to the bartender in the popup
	document.querySelector(`#pop-bartenders .bart-${thisBartender}`).appendChild(clone);
}

//Function counting how many beers have been sold
function countBeer(data) {
	const serving = data.serving;
	beer.lastCount = beer.newCount;

	serving.forEach((person) => {
		if (!beer.beerArray.includes(person.id)) {
			beer.beerArray.push(person.id);
			beer.newCount = beer.newCount + person.order.length;
		}
	});

	displayIncome();

	const isChange = beer.lastCount == beer.newCount;

	//Checking if last count and new count are different, we only want a reload if the value have changed
	if (!isChange) {
		displayDonutChart();
	}
}

//Function to display the income
function displayIncome() {
	document.querySelectorAll(".income-number").forEach((span) => {
		span.textContent = calculateIncome() + ",-";
	});
}

//Function calculating the income
function calculateIncome() {
	let beerPrice = 50;

	if (realTime.isHappyHour) {
		beerPrice = 25;
	}

	const income = beer.newCount * beerPrice;
	return income;
}

//Function to display the donut chart
function displayDonutChart() {
	//Using the calculate income to get the income for display
	let income = calculateIncome();

	//Calculating how much is left before the dayly goal is met.
	//If the income is higher than the goal income is set to max and goal to 0 every time
	let goal = 10000;
	if (income > 10000) {
		income = 10000;
		goal = 0;
	} else {
		goal = 10000 - income;
	}

	const chartContainer = document.querySelectorAll(".chart-container");
	//Removing the old canvas, since clear and destroy is not working
	chartContainer.forEach((container) => {
		container.innerHTML = "";

		//Creating a new canvas element to display the update
		const canvas = document.createElement("canvas");

		container.appendChild(canvas);

		const donutChart = container.querySelector("canvas");

		//Making the donut chart
		const xValues = ["income", "none"];
		let yValues = [income, goal];
		const barColors = ["#efd7b3", "transparent"];

		new Chart(donutChart, {
			type: "doughnut",
			data: {
				datasets: [
					{
						backgroundColor: barColors,
						data: yValues,
					},
				],
			},
			options: {
				title: {
					display: false,
					text: "Income",
				},
				borderColor: "transparent",
			},
		});
	});
}

//Function toggleling hide from object
function toggleHide(element) {
	if (element.classList.contains("hide")) {
		element.classList.remove("hide");
	} else {
		element.classList.add("hide");
	}
}

function showBeer(data) {
	document.querySelector("#dash-taps").innerHTML = "";

	data.taps.forEach((beer) => {
		const clone = document.querySelector("template.tap").content.cloneNode(true);

		clone.querySelector("img").src = `assets/${beer.beer}.svg`;
		clone.querySelector("p").textContent = beer.beer;

		document.querySelector("#dash-taps").appendChild(clone);
	});

	document.querySelector("#popup-dash-taps").innerHTML = "";
	document.querySelector("#popup-storage").innerHTML = "";

	data.taps.forEach((beer) => {
		const clone = document.querySelector("template.popup-tap").content.cloneNode(true);

		clone.querySelector("img").src = `assets/${beer.beer}.svg`;
		clone.querySelector("p").textContent = beer.beer;
		clone.querySelector("p:nth-child(2)").textContent = `${beer.level}/${beer.capacity}`;

		document.querySelector("#popup-dash-taps").appendChild(clone);
	});

	data.storage.forEach((beerType) => {
		const clone = document.querySelector("template.storage").content.cloneNode(true);

		clone.querySelector(".name").textContent = beerType.name;
		clone.querySelector(".number").textContent = beerType.amount;

		document.querySelector("#popup-storage").appendChild(clone);
	});
}

//Function calculating the statistics of each bartender
function calculateBartenderStats(data) {
	const bartenders = data.bartenders;
	const custumer = data.serving;

	let beerPrice = 50;

	if (realTime.isHappyHour) {
		beerPrice = 25;
	}

	//Calculating for each bartender
	bartenders.forEach((bartender) => {
		const custNumber = bartender.servingCustomer;

		custumer.forEach((custumer) => {
			//Looking for the order they are serving
			if (custumer.id === custNumber) {
				//Checking if the order has already been counted
				if (!beerSold.custumersServed.includes(custumer.id)) {
					//Pushing the id to array to make sure it wont be counted twice
					beerSold.custumersServed.push(custumer.id);

					//updating the global object
					const thisBartender = bartender.name;
					beerSold[thisBartender].sold += custumer.order.length;
					beerSold[thisBartender].custServed += 1;
					beerSold[thisBartender].income = beerSold[thisBartender].sold * beerPrice;
				}
			}
		});
	});
}

function claculateCalendar() {
	const today = new Date();
	const month = String(today.getMonth() + 1).padStart(2, "0"); //January is 0
	const year = today.getFullYear();
	const day = String(today.getDate()).padStart(1, "0");

	calendarData.currentMonth = month;
	calendarData.currentYear = year;
	calendarData.currentDay = day;

	displayCalendar(month, year);
	dispayDashCalendar(day, month);
	displayActiveDay();
	registerCells();
}

async function displayCalendar(month, year) {
	//Display the curent month on the calendar
	document.querySelector("#month").textContent = calendarData.monthArray[month - 1];

	//Display the year on the calendar
	document.querySelector("#year").textContent = year;

	console.log("month", month);
	console.log("year", year);
	console.log("days", daysInMonth(month, year));

	//This the date of the first day of the month
	let firstDay = new Date(year, month - 1).getDay();
	console.log("firstDay", firstDay);

	//Clear the table
	document.querySelector("#calendar-table tbody").innerHTML = "";

	//Creating the table with the month
	let date = 1;

	const actualMonth = new Date().getMonth() + 1;
	const today = new Date();
	const currentDate = String(today.getDate()).padStart(1, "0");

	//for loop for creating the rows of the calendar, there can be up to 6
	for (let i = 0; i < 6; i++) {
		//Create a table row
		let row = document.createElement("tr");

		//For loop for creating the cells with data in the table row
		for (let j = 1; j <= 7; j++) {
			//placing the first day in the right postion
			//i === 0: we are on the first row, j < firstday: firstday is later in the week
			if (i === 0 && j < firstDay) {
				//Create an emty cell and appent to row
				let cell = document.createElement("td");
				let cellText = document.createTextNode("");
				cell.appendChild(cellText);
				row.appendChild(cell);

				//Make sure to stop if end of month is reached
			} else if (date > daysInMonth(month, year)) {
				if (j <= 7) {
					//Create an emty cell and appent to row
					let cell = document.createElement("td");
					let cellText = document.createTextNode("");
					cell.appendChild(cellText);
					row.appendChild(cell);
				} else {
					break;
				}

				//Create cell with date number
			} else {
				let cell = document.createElement("td");
				let cellText = document.createTextNode(date);
				cell.appendChild(cellText);
				cell.setAttribute("id", `${date}`);

				if (actualMonth == month && date == currentDate) {
					cell.setAttribute("class", "today active-day");
				} else if (date == calendarData.currentDay) {
					cell.setAttribute("class", "active-day");
				}

				row.appendChild(cell);
				date++;
			}
		}
		//Append to the table
		document.querySelector("#calendar-table tbody").appendChild(row);
	}
	await displayEventMarkers();
}

async function displayEventMarkers() {
	const eData = await fetchfunction("events.json");

	eData.forEach((event) => {
		if (calendarData.currentYear == event.date.year) {
			if (calendarData.currentMonth == event.date.month) {
				document.querySelector(`td[id="${event.date.day}"]`).classList.add("has-event");
			}
		}
	});
}

function displayEvents(events, selector) {
	console.log("events", events);

	let hasEvent = false;

	events.forEach((event) => {
		if (calendarData.currentYear == event.date.year) {
			if (calendarData.currentMonth == event.date.month) {
				console.log("Is in december");
				if (calendarData.currentDay == event.date.day) {
					console.log("its the right day");

					const clone = document.querySelector("#temp-event").content.cloneNode(true);

					//Insert events in clone
					clone.querySelector(".title").textContent = event.name;
					clone.querySelector(".description").textContent = event.description;
					clone.querySelector(".time").textContent = `${event.time.start} - ${event.time.end}`;

					//Append clone to section
					selector.appendChild(clone);

					hasEvent = true;
				}
			}
		}
	});

	if (!hasEvent) {
		let span = document.createElement("span");
		span.textContent = "No events planned";

		selector.appendChild(span);
	}
}

function daysInMonth(month, year) {
	//Returning the number of days in a month
	return new Date(year, month, 0).getDate();
}

function goForward() {
	console.log(calendarData.currentMonth);
	if (calendarData.currentMonth == 12) {
		calendarData.currentMonth = 1;
		calendarData.currentYear++;
	} else {
		calendarData.currentMonth++;
	}

	displayCalendar(calendarData.currentMonth, calendarData.currentYear);
	displayActiveDay();
	registerCells();
}

function goBack() {
	if (calendarData.currentMonth == 1) {
		calendarData.currentMonth = 12;
		calendarData.currentYear--;
	} else {
		calendarData.currentMonth--;
	}

	displayCalendar(calendarData.currentMonth, calendarData.currentYear);
	displayActiveDay();
	registerCells();
}

async function displayActiveDay() {
	const month = calendarData.monthArray[calendarData.currentMonth - 1];

	document.querySelector("#active-title").textContent = `${month} ${calendarData.currentDay}`;

	const selector = document.querySelector("#event-wrapper");
	selector.innerHTML = "";
	const eventData = await fetchfunction("events.json");

	displayEvents(eventData, selector);
}

function registerCells() {
	document.querySelectorAll("td").forEach((cell) => {
		//Making sure not to add eventlisteners to empty cells
		if (!cell.textContent == "") {
			//Add eventlistener to the cells
			cell.addEventListener("click", () => {
				//Set currentDay to this cell
				calendarData.currentDay = cell.id;

				//Remove class active-day from last active
				document.querySelector(".active-day").classList.remove("active-day");

				//Add active-day class to this cell
				cell.classList.add("active-day");
				displayActiveDay();
			});
		}
	});
}

async function dispayDashCalendar(day, month) {
	console.log(day, month);

	const monthName = calendarData.monthArray[month - 1];

	document.querySelector("#calendar-today").textContent = `${monthName} ${day}`;

	if (day == 1 || day == 21 || day == 31) {
		document.querySelector("#calendar-today").textContent += "st";
	} else if (day == 2 || day == 22) {
		document.querySelector("#calendar-today").textContent += "nd";
	} else if (day == 3 || day == 23) {
		document.querySelector("#calendar-today").textContent += "rd";
	} else {
		document.querySelector("#calendar-today").textContent += "th";
	}

	const selector = document.querySelector("#dash-event");
	const eventData = await fetchfunction("events.json");

	displayEvents(eventData, selector);
}

async function getStorage() {
	const dataUrl = "https://groupfoobar.herokuapp.com/";

	const data = await fetchfunction(dataUrl);

	document.querySelector("#popup-storage").innerHTML = "";

	data.storage.forEach((beerType) => {
		const clone = document.querySelector("template.storage").content.cloneNode(true);

		clone.querySelector(".name").textContent = beerType.name;
		clone.querySelector(".number").textContent = beerType.amount;

		document.querySelector("#popup-storage").appendChild(clone);
	});
}
