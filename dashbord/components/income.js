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
        <h1>Income</h1>

        <div class="popup-content popup-content-income">
            <div id="curent-income">
                <div id="left">
                <h3>Daily income</h3>
                <div id="popup-chart-container">
                <div class="loader">
                <svg height="100" width="100">
                  <circle cx="50" cy="50" r="40" />
                </svg>
              </div>
                </div>
                </div>
                <div id="numbers">
                    <p id="popup-income-number"></p>
                    <p>Goal: 10.000</p>
                </div>
            </div>
            <div id="past-income">
                <h3>Income of last 7 days</h3>
                <div id="bar-wrapper">
                <div class="inc-bar" id="day-1">
                    <span>10.000</span>
                </div>
                <div class="inc-bar" id="day-2">
                    <span>12.000</span>
                </div>
                <div class="inc-bar" id="day-3">
                    <span>9.000</span>
                </div>
                <div class="inc-bar" id="day-4">
                    <span>7.500</span>
                </div>
                <div class="inc-bar" id="day-5">
                    <span>10.000</span>
                </div>
                <div class="inc-bar" id="day-6">
                    <span>13.000</span>
                </div>
                <div class="inc-bar" id="day-7">
                    <span>11.500</span>
                </div>
                </div>
            </div>
        </div>
    </article>`;

  document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#popup").innerHTML = "";
  });
}
