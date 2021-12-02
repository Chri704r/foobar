import "../style.scss";

window.addEventListener("DOMContentLoaded", registerButtons);

function registerButtons() {
  document.querySelectorAll(".popup-queue").forEach((button) => {
    button.addEventListener("click", displayQueue);
  });

  document.querySelector("#dash-queue").addEventListener("click", displayQueue);
}

function displayQueue() {
  console.log("Should display queue");
  document.querySelector("#popup").innerHTML = `
    <article>
        <div class="outer close-popup">
            <div class="inner">
                <label>Close</label>
            </div>
        </div>
        <h1>Queue</h1>
        <div class="popup-content popup-content-queue">
            <div id="pop-bar-1">
                <span></span>
            </div>
            <div id="pop-bar-2">
                <span></span>
            </div>
            <div id="pop-bar-3">
                <span></span>
            </div>
            <div id="pop-bar-4">
                <span></span>
            </div>
            <div id="pop-bar-5">
                <span></span>
            </div>
            <div id="pop-bar-6">
                <span></span>
            </div>
            <div id="pop-bar-7">
                <span></span>
            </div>
            <div id="pop-bar-8">
                <span></span>
            </div>
            <div id="pop-bar-9">
                <span></span>
            </div>
            <div id="pop-bar-10">
                <span></span>
            </div>
        </div>
    </article>`;

  document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#popup").innerHTML = "";
  });

  dispalyData();
}

function dispalyData() {}
