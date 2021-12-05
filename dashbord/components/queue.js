import "../style.scss";

window.addEventListener("DOMContentLoaded", registerButtons);

function registerButtons() {
  document.querySelectorAll(".popup-queue").forEach((button) => {
    button.addEventListener("click", displayQueue);
  });

  document.querySelector("#dash-queue").addEventListener("click", displayQueue);
}

function displayQueue() {
  document.querySelector("#popup").innerHTML = `
    <article>
        <div class="outer close-popup">
            <div class="inner">
                <label>Close</label>
            </div>
        </div>
        <h1>Queue</h1>
        <div class="popup-content popup-content-queue">
            <div class="loader">
                <svg height="100" width="100">
                    <circle cx="50" cy="50" r="40" />
                </svg>
            </div>

            <div id="pop-bar-1" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-2" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-3" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-4" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-5" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-6" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-7" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-8" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-9" class="bar hide">
                <span></span>
            </div>
            <div id="pop-bar-10" class="bar hide">
                <span></span>
            </div>
        </div>
    </article>`;

  document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#popup").innerHTML = "";
  });
}
