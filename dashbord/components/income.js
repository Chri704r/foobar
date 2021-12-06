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
    `;

  document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#popup").innerHTML = "";
  });
}
