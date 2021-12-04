import "../style.scss";

window.addEventListener("DOMContentLoaded", registerButtons);

function registerButtons() {
	document.querySelectorAll(".popup-beer").forEach((button) => {
		button.addEventListener("click", displayBeer);
	});

	document.querySelector("#dash-taps").addEventListener("click", displayBeer);
}

function displayBeer() {
	console.log("Beer is displayed");
	document.querySelector("#popup").innerHTML = `
    <article>
        <div class="outer close-popup">
            <div class="inner">
                <label>Close</label>
            </div>
        </div>
        <h1>Beers</h1>
        <div class="popup-content popup-content-beer">
        <section id="popup-dash-taps"></section>
        <section id="popup-storage"></section>
        </div>
        `;

	document.querySelector(".close-popup").addEventListener("click", () => {
		document.querySelector("#popup").innerHTML = "";
	});
}
