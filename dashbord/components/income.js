import "../style.scss";

window.addEventListener("DOMContentLoaded", registerButtons);

function registerButtons() {
  document.querySelectorAll(".popup-income").forEach((button) => {
    button.addEventListener("click", displayIncome);
  });

  document
    .querySelector("#dash-income")
    .addEventListener("click", displayIncome);
}

function displayIncome() {
  document.querySelector("#popup").innerHTML = `
    <article>
        <div class="outer close-popup">
            <div class="inner">
                <label>Close</label>
            </div>
        </div>
        <h1>Queue</h1>

        <div class="popup-content popup-content-queue">
            <div id="curent-income">
                <h3>Daily income</h3>
                <div id="popup-chart-container">
                    <canvas id="popup-income-chart">
                </div>
                <div id="numbers">
                    <p id="popup-income-number"></p>
                    <p>Goal: 10.000</p>
                <div>
            </div>
            <div id="past-income">
                <div class="inc-bar"> id="day-1">
                    <span>10.000</span>
                </div>
                <div class="inc-bar"> id="day-2">
                    <span>10.000</span>
                </div>
                <div class="inc-bar"> id="day-3">
                    <span>10.000</span>
                </div>
                <div class="inc-bar"> id="day-4">
                    <span>10.000</span>
                </div>
                <div class="inc-bar"> id="day-5">
                    <span>10.000</span>
                </div>
                <div class="inc-bar"> id="day-6">
                    <span>10.000</span>
                </div>
                <div class="inc-bar"> id="day-7">
                    <span>10.000</span>
                </div>
            </div>
        </div>
    </article>`;

  document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#popup").innerHTML = "";
  });
}
