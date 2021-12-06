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
    `;

  document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#popup").innerHTML = "";
  });
}
