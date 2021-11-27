import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

function init() {
	getData();
	setInterval(setDate, 1000);
}

async function getData() {
	const dataUrl = "https://groupfoobar.herokuapp.com/";
	const beerUrl = "https://groupfoobar.herokuapp.com/beertypes";

	const data = await fetchfunction(dataUrl);
	const beerData = await fetchfunction(beerUrl);
	console.log("data", data);
	console.log("beer", beerData);

	showQueue(data);
	showServing(data);

	setTimeout(getData, 5000);
}

async function fetchfunction(url) {
	const response = await fetch(url);

	const data = await response.json();
	return data;
}

function showQueue(data) {
	document.querySelector("#queue-container").innerHTML = "";

	data.queue.forEach((order) => {
		const clone = document.querySelector("template.customer-dashboard").content.cloneNode(true);

		clone.querySelector(".ordernumber").textContent = order.id;

		//show each beer in order
		order.order.forEach((orderlist) => {
			const orderContainer = document.createElement("p");
			orderContainer.textContent = orderlist;

			clone.querySelector(".order").appendChild(orderContainer);
		});

		document.querySelector("#queue-container").appendChild(clone);
	});
}

function showServing(data) {
	document.querySelector("#serving-container").innerHTML = "";

	data.serving.forEach((serve) => {
		const clone = document.querySelector("template.customer-dashboard").content.cloneNode(true);

		clone.querySelector(".ordernumber").textContent = serve.id;

		//show each beer in order
		serve.order.forEach((orderlist) => {
			const orderContainer = document.createElement("p");
			orderContainer.textContent = orderlist;

			clone.querySelector(".order").appendChild(orderContainer);
		});

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

	//add style to the hands
	secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
	minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
	hourHand.style.transform = `rotate(${hourDegrees}deg)`;

	//show digital clock
	document.querySelector(".digital-clock").innerHTML = `${hours}:${minutes}:${seconds}`;
}
