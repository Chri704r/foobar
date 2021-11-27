import "./style.scss";

window.addEventListener("DOMContentLoaded", init);
const settings = {
  filter: "all",
};
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

  //setTimeout(getData, 5000);
  showMenu(beerData);
  registerButtons();
}

async function fetchfunction(url) {
  const response = await fetch(url);

  const data = await response.json();

  return data;
}

function registerButtons() {
  console.log("registered buttons");
  document.querySelectorAll("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", selectFilter);
  });
}

function selectFilter(event) {
  console.log("select filter");
  const filter = event.target.dataset.filter;
  console.log(`User selcted ${filter}`);
}

function showMenu(beerData) {
  console.log("vis menu");

  beerData.forEach((menu) => {
    const clone = document.querySelector(".products").content.cloneNode(true);

    clone.querySelector(".product").textContent = beerData.name;

    clone.querySelector(".product_container");
    document.querySelector(".products_container").appendChild(clone);
  });
}
