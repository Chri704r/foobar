import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  const response = await fetch("https://groupfoobar.herokuapp.com/");

  const data = await response.json();
  console.log("data", data);
}
