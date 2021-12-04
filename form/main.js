import "./style.scss";

window.addEventListener("DOMContentLoaded", init);
//array for all beers
let allBeers = [];
let Beer = {
  beerName: "",
  imageName: "",
  category: "",
  description: "",
  aroma: "",
  appearance: "",
  flavor: "",
  mouthfeel: "",
  overallImpression: "",
  alc: "",
  basket: false,
};
const settings = {
  filter: "all",
};
let basketData = [];
// const basketData = {
//   beerInBasket: "",
// };
function init() {
  getData();
  registerButtons();
}

function registerButtons() {
  console.log("registered buttons");
  document.querySelectorAll("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", selectFilter);
  });
  document.querySelector(".cart").addEventListener("click", showBasket);
}

//loading json
async function getData() {
  // const response = await fetch("https://groupfoobar.herokuapp.com/");
  // const data = await response.json();

  const responseBeer = await fetch("https://groupfoobar.herokuapp.com/beertypes");
  const beerData = await responseBeer.json();
  console.log("beer Data", beerData);
  prepareObjects(beerData);
}
//prepare objects
function prepareObjects(beers) {
  console.log("prepare objects");
  beers.forEach((elm) => {
    const beer = Object.create(Beer);

    beer.beerName = getBeerName(elm.name);

    beer.imageName = getImage(beer.beerName);
    beer.category = getCategory(elm.category);

    beer.description = elm.description;
    beer.alc = elm.alc;

    allBeers.push(beer);
  });
  //fixed so we filter and sort on the first load
  buildList();
}

// get firstName from fullName
function getBeerName(name) {
  // console.log("get beer name");
  let beerName = name;
  // console.log("beer name", beerName);
  return beerName;
}
// Get image
function getImage(beerName) {
  // console.log("get image");
  let imageName;

  //imageName = beerName.toLowerCase();
  if (beerName.includes(" ")) {
    beerName = beerName.toLowerCase();
    imageName = `./psb_img/${beerName.replaceAll(" ", "_")}.png`;
  } else {
    imageName = `./psb_img/${beerName.toLowerCase()}.png`;
  }
  // console.log("img name", imageName);
  return imageName;
}
// Get house
function getCategory(category) {
  return category;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selcted ${filter}`);
  setFilter(filter);
}
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
function buildList() {
  const currentList = filterList(allBeers);
  displayList(currentList);
}

function filterList(filteredList) {
  if (settings.filterBy === "Belgian Specialty Ale") {
    filteredList = allBeers.filter(isBelgian);
  } else if (settings.filterBy === "IPA") {
    filteredList = allBeers.filter(isIPA);
  } else if (settings.filterBy === "California Common") {
    filteredList = allBeers.filter(isCalifornia);
  } else if (settings.filterBy === "Hefeweizen") {
    filteredList = allBeers.filter(isHefeweizen);
  } else if (settings.filterBy === "Stout") {
    filteredList = allBeers.filter(isStout);
  } else if (settings.filterBy === "Oktoberfest") {
    filteredList = allBeers.filter(isOktoberfest);
  }

  return filteredList;
}

function isBelgian(beer) {
  return beer.category === "Belgian Specialty Ale";
}
function isIPA(beer) {
  return beer.category === "IPA";
}
function isCalifornia(beer) {
  return beer.category === "California Common";
}
function isHefeweizen(beer) {
  return beer.category === "Hefeweizen";
}
function isStout(beer) {
  return beer.category === "Stout";
}
function isOktoberfest(beer) {
  return beer.category === "Oktoberfest";
}
function displayList(beers) {
  // console.log("display list");
  // clear the list
  document.querySelector("#beers").innerHTML = "";

  // build a new list
  beers.forEach(displayBeer);
}

function displayBeer(beer) {
  // console.log("display beers");

  // create clone
  const clone = document.querySelector("#beer").content.cloneNode(true);

  //Set clone data
  clone.querySelector("[data-field=imageName]").src = beer.imageName;
  //add to cart
  // - - Add eventlistener to add to cart
  clone.querySelector(".add_to_cart").addEventListener("click", basketClicked);

  function basketClicked() {
    basketCheck(beer);
  }
  //click to see details
  clone.querySelector(".read_more").addEventListener("click", () => showDetails(beer));

  // append clone to list
  /////////////
  document.querySelector("#beers").appendChild(clone);
}
function showDetails(beer) {
  // console.log("display deatails");
  document.querySelector("main").classList.add("no_scroll");
  const clone = document.querySelector("#information").cloneNode(true).content;
  popup.textContent = "";
  clone.querySelector("[data-field=imageName]").src = beer.imageName;
  clone.querySelector("[data-field=beerName]").textContent = `${beer.beerName}`;

  clone.querySelector("[data-field=aroma]").textContent = `Aroma: ${beer.description.aroma}`;
  clone.querySelector("[data-field=appearance]").textContent = `Appearance: ${beer.description.appearance}`;
  clone.querySelector("[data-field=flavor]").textContent = `Flavor: ${beer.description.flavor}`;
  clone.querySelector("[data-field=mouthfeel]").textContent = `Mouthfeel: ${beer.description.mouthfeel}`;
  clone.querySelector("[data-field=overallImpression]").textContent = `OverallImpression: ${beer.description.overallImpression}`;
  clone.querySelector("[data-field=alc]").textContent = `${beer.alc}% Alc`;
  clone.querySelector("[data-field=price]").textContent = `50 -kr.`;

  //add to cart
  // - - Add eventlistener to add to cart - mobile
  clone.querySelector(".add_to_basket").addEventListener("click", basketClicked);

  function basketClicked() {
    basketCheck(beer);
  }
  popup.classList.add("active");
  document.querySelector(".popup_border").classList.remove("hide");
  blured.classList.add("active");
  document.querySelector("header").classList.add("blurr");
  document.querySelector(".basket_border").classList.add("blurr");

  clone.querySelector("#close").addEventListener("click", closeDetails);
  popup.appendChild(clone);
}
function closeDetails() {
  popup.classList.remove("active");
  document.querySelector(".popup_border").classList.add("hide");
  blured.classList.remove("active");
  document.querySelector("header").classList.remove("blurr");
  document.querySelector(".basket_border").classList.remove("blurr");
  document.querySelector("main").classList.remove("no_scroll");
}

function showBasket() {
  console.log("show basket");
  const basket = document.querySelector(".basket");
  const basketBorder = document.querySelector(".basket_border");

  basket.style.visibility = "visible";
  basketBorder.style.visibility = "visible";
  basket.classList.add("active");
  blured.classList.add("active");
  document.querySelector(".basket #close").addEventListener("click", closeBasket);
}
function closeBasket() {
  const basket = document.querySelector(".basket");
  const basketBorder = document.querySelector(".basket_border");

  basket.style.visibility = "hidden";
  basketBorder.style.visibility = "hidden";
  basket.classList.remove("active");
  blured.classList.remove("active");
}

function goToCheckout() {
  document.querySelector("#payment").classList.remove("hide");
  document.querySelector("#menu").classList.add("hide");
  document.querySelector("header .cart").classList.add("hide");
  document.querySelector("header .go_back").classList.remove("hide");

  document.querySelector("header .go_back").addEventListener("click", goBack);

  document.querySelector("header").classList.add("responsive_header");

  if (screen.width < 700) {
    closeBasket();
  } else {
  }
}

function goBack() {
  document.querySelector("#payment").classList.add("hide");
  document.querySelector("#menu").classList.remove("hide");
  document.querySelector("header .cart").classList.remove("hide");
  document.querySelector("header .go_back").classList.add("hide");
  document.querySelector("header").classList.remove("responsive_header");
}

function basketCheck(selectedBeer) {
  console.log("check basket");
  //const basket = allBeers.filter((beer) => beer.basket);

  addToBasket(selectedBeer);

  // function removePrefect(studentPrefect) {
  //   studentPrefect.prefect = false;
  // }

  function addToBasket(beerName) {
    console.log("add to basket", selectedBeer);
    beerName.basket = true;

    saveDataInfo(selectedBeer);
    document.querySelector(".basket .checkout").addEventListener("click", goToCheckout);
  }

  function saveDataInfo(selectedBeer) {
    console.log("basketData", basketData);
    // sends the beerName
    basketData.push(selectedBeer);
    //shows information in basket
    showInBasket(selectedBeer);
    //shows information on order
    addToOrder(selectedBeer);
  }
}
function showInBasket(selectedBeer) {
  // // objects for basket
  // name out of selected beer
  let classNameBeer = selectedBeer.beerName.replaceAll(" ", "_").toLowerCase();
  //checks how many of the same beer are in the basket
  let other = basketData.filter((beer) => beer.beerName === selectedBeer.beerName);
  let numberOfBeer = other.length;
  // console.log("other", other);
  // console.log("selected", selectedBeer);
  //number of beers in basket
  const quantity = document.createElement("p");
  quantity.classList.add("quantity");
  quantity.classList.add(`${classNameBeer}`);

  // div for details, + and number of beers, - and price
  const detailsCont = document.createElement("div");
  detailsCont.classList.add("details_container");
  // div for each added beer to the basket
  const basketTxtCont = document.createElement("div");
  //price
  const price = document.createElement("p");
  price.classList.add("price");
  price.classList.add(`${classNameBeer}`);
  const priceValue = 50;

  const plus = document.createElement("p");
  plus.classList.add("quant_border");
  plus.classList.add(`${classNameBeer}_plus`);
  // plus.addEventListener("click", plusBeerBasket);
  // if there is another beer of the same type it changes the number of beers

  if (numberOfBeer > 1 && basketData.includes(selectedBeer)) {
    //updates the number of each beer in basket
    document.querySelector(`.quantity.${classNameBeer}`).textContent = `${numberOfBeer}`;
    // Price of beers in basket
    document.querySelector(`.price.${classNameBeer}`).textContent = `${priceValue * numberOfBeer}-,`;
  } else {
    // beer name on list and puttet inside the basket container in the basket
    const p = document.createElement("p");
    p.textContent = `${selectedBeer.beerName}`;
    basketTxtCont.append(p);
    // plus to add more beers inside the details container
    // // TO DO:

    plus.textContent = "+";
    detailsCont.append(plus);

    quantity.textContent = `${numberOfBeer}`;
    detailsCont.append(quantity);

    // minus to minus one beer at a time beer inside the details container
    // // TO DO:
    const minus = document.createElement("p");
    minus.classList.add("quant_border");
    minus.classList.add(`${classNameBeer}_minus`);

    minus.textContent = "-";
    detailsCont.append(minus);
    //basketTxtCont.append(detailsCont);
    // price tag

    price.textContent = `${priceValue}-,`;
    detailsCont.append(price);

    basketTxtCont.append(detailsCont);
    // puts the div with each beer type on the list
    document.querySelector(".basket_items").append(basketTxtCont);
  }
  basketTxtCont.classList.add("basket_order_cont");

  function plusBeerBasket() {
    console.log("plus beer", selectedBeer);
    basketData.push(selectedBeer);
    console.log("basket data", basketData);
    //updates the number of each beer in basket
    document.querySelector(`.quantity.${classNameBeer}`).textContent = `${numberOfBeer}`;
    // Price of beers in basket
    document.querySelector(`.price.${classNameBeer}`).textContent = `${priceValue * numberOfBeer}-,`;
    console.log("number of bjór", numberOfBeer);
  }
}

function addToOrder(selectedBeer) {
  const textContainer = document.createElement("div");
  textContainer.classList.add("order_txt_cont");

  document.querySelector(".order_txt_parent").append(textContainer);

  const x = document.createElement("p");
  x.textContent = "x";

  const p = document.createElement("p");

  p.textContent = `${selectedBeer.beerName}`;

  textContainer.append(x);
  textContainer.append(p);
}
