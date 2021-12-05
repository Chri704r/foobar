import "../style.scss";

window.addEventListener("DOMContentLoaded", registerButtons);

function registerButtons() {
  document.querySelectorAll(".popup-bartender").forEach((button) => {
    button.addEventListener("click", displayBartender);
  });

  document
    .querySelector("#dash-bartenders")
    .addEventListener("click", displayBartender);
}

function displayBartender() {
  document.querySelector("#popup").innerHTML = `
    <article>
        <div class="outer close-popup">
            <div class="inner">
                <label>Close</label>
            </div>
        </div>
        <h1>Bartenders</h1>
        <div class="popup-content popup-content-bartender">
            <div id="pop-bartenders">
                <div class="loader">
                    <svg height="100" width="100">
                        <circle cx="50" cy="50" r="40" />
                    </svg>
                </div>
            </div>
        </div>
    </article>`;

  document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#popup").innerHTML = "";
  });
}
