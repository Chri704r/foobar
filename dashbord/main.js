import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

function init() {
	getData();
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

		clone.querySelector(".order").textContent = order.order;
		clone.querySelector(".ordernumber").textContent = order.id;

		document.querySelector("#queue-container").appendChild(clone);
	});
}

function showServing(data) {
	document.querySelector("#serving-container").innerHTML = "";

	data.serving.forEach((serve) => {
		const clone = document.querySelector("template.customer-dashboard").content.cloneNode(true);

		clone.querySelector(".order").textContent = serve.order;
		clone.querySelector(".ordernumber").textContent = serve.id;

		document.querySelector("#serving-container").appendChild(clone);
	});
}
