import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

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

  setTimeout(getData, 5000);
}

async function fetchfunction(url) {
  const response = await fetch(url);

  const data = await response.json();
  return data;
}
