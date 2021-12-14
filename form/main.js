import "./style.scss";

window.addEventListener("DOMContentLoaded", init);
//array for all beers
let allBeers = [];
console.log("allBeers", allBeers);
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
};
const settings = {
  filter: "all",
};
let basketData = [];

const validation = {
  mail: false,
  cardnumber: false,
  name: false,
  month: false,
  year: false,
  cvc: false,
};

function init() {
  getData();
  registerButtons();
  // make the basket in mobile view look empty empty basket
  fill.style.fill = "transparent";
}

//loading json
async function getData() {
  // const response = await fetch("https://groupfoobar.herokuapp.com/");
  // const data = await response.json();

  const responseBeer = await fetch(
    "https://groupfoobar.herokuapp.com/beertypes"
  );
  const beerData = await responseBeer.json();
  console.log("beer Data", beerData);

  async function dataLoop() {
    const responseData = await fetch("https://groupfoobar.herokuapp.com/");
    const tapData = await responseData.json();
    console.log("tabData", tapData);

    prepareObjects(beerData, tapData);

    setTimeout(dataLoop, 5000);
  }

  dataLoop();
}

function registerButtons() {
  console.log("registered buttons");
  document.querySelectorAll("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", selectFilter);
  });
  document.querySelector(".shoppingcart").addEventListener("click", showBasket);
}
//prepare objects
function prepareObjects(beers, taps) {
  console.log("prepare objects");
  const tapArray = [];
  allBeers = [];

  taps.taps.forEach((tap) => {
    tapArray.push(tap.beer);
  });

  beers.forEach((elm) => {
    if (tapArray.includes(elm.name)) {
      const beer = Object.create(Beer);

      beer.beerName = getBeerName(elm.name);

      beer.imageName = getImage(beer.beerName);
      beer.category = getCategory(elm.category);

      beer.description = elm.description;
      beer.alc = elm.alc;

      allBeers.push(beer);
    }
  });
  //fixed so we filter on the first load
  buildList();
}

function getBeerName(name) {
  let beerName = name;
  return beerName;
}

function getImage(beerName) {
  let imageName;

  if (beerName.includes(" ")) {
    beerName = beerName.toLowerCase();
    imageName = `./psb_img/${beerName.replaceAll(" ", "_")}.png`;
  } else {
    imageName = `./psb_img/${beerName.toLowerCase()}.png`;
  }

  return imageName;
}

function getCategory(category) {
  return category;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selcted ${filter}`);

  const selectedFilters = document.querySelectorAll(".active_button");

  selectedFilters.forEach((filter) => {
    filter.classList.remove("active_button");
  });
  setFilter(filter);
}
function setFilter(filter) {
  settings.filterBy = filter;

  document
    .querySelector(`[data-filter=${filter}]`)
    .classList.add("active_button");

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

//display the list of beers on menu
function displayList(beers) {
  document.querySelector("#beers").innerHTML = "";
  beers.forEach(displayBeer);
}

function displayBeer(beer) {
  const clone = document.querySelector("#beer").content.cloneNode(true);

  //Set clone data

  clone.querySelector("[data-field=imageName]").src = beer.imageName;
  clone.querySelector("[data-field=beerName]").textContent = `${beer.beerName}`;

  //add to cart
  clone.querySelector(".add_to_cart").addEventListener("click", (e) => {
    //add checkmark when clicked
    e.target.innerHTML = `<img class="checkmark" src="../assets/checkmark.svg" >`;
    basketCheck(beer);
  });

  // basket on the mobile view was clicked
  function basketClicked() {
    basketCheck(beer);
  }
  //click to see details
  clone
    .querySelector(".read_more")
    .addEventListener("click", () => showDetails(beer));

  // append clone to list

  document.querySelector("#beers").appendChild(clone);
}
function showDetails(beer) {
  document.querySelector("#blured").addEventListener("click", closeDetails);
  document.querySelector("main").classList.add("no_scroll");
  const clone = document.querySelector("#information").cloneNode(true).content;
  popup.textContent = "";
  clone.querySelector("[data-field=imageName]").src = beer.imageName;
  clone.querySelector("[data-field=beerName]").textContent = `${beer.beerName}`;

  clone.querySelector(
    "[data-field=aroma]"
  ).textContent = `${beer.description.aroma}`;
  clone.querySelector(
    "[data-field=appearance]"
  ).textContent = `${beer.description.appearance}`;
  clone.querySelector(
    "[data-field=flavor]"
  ).textContent = `${beer.description.flavor}`;
  clone.querySelector(
    "[data-field=mouthfeel]"
  ).textContent = `${beer.description.mouthfeel}`;
  clone.querySelector(
    "[data-field=overallImpression]"
  ).textContent = `${beer.description.overallImpression}`;
  clone.querySelector("[data-field=alc]").textContent = `${beer.alc}% Alc`;
  clone.querySelector("[data-field=price]").textContent = `50,-`;

  //add to cart from the popup view
  clone
    .querySelector(".add_to_basket")
    .addEventListener("click", basketClicked);

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
function basketStatus() {
  console.log("basket status, basketdata length", basketData.length);
  if (basketData.length > 0) {
    fill.style.fill = "#eed6b3";
    document.querySelector(".basket .checkout").classList.remove("hide");
    document
      .querySelector(".basket .checkout")
      .addEventListener("click", goToCheckout);
  } else {
    fill.style.fill = "transparent";
    document.querySelector(".basket .checkout").classList.add("hide");
  }
}
function showBasket() {
  console.log("show basket");
  const basket = document.querySelector(".basket");
  const basketBorder = document.querySelector(".basket_border");

  basket.style.visibility = "visible";
  basketBorder.style.visibility = "visible";
  basket.classList.add("active");
  blured.classList.add("active");
  document.querySelector("#blured").addEventListener("click", closeBasket);
  document
    .querySelector(".basket #close")
    .addEventListener("click", closeBasket);
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
  document.querySelector("header .shoppingcart").classList.add("hide");
  document.querySelector("header .go_back").classList.remove("hide");

  document.querySelector("header .go_back").addEventListener("click", goBack);

  registerValidation();

  jumpCard();

  document.querySelector("header").classList.add("responsive_header");
  document.querySelector(".basket_items").innerHTML = "";
  prepareOrder();
  registerPayment();
  if (screen.width < 1000) {
    closeBasket();
  } else {
  }
}

function jumpCard() {
  const cardnumber = document.querySelector("#cardNumber");
  const name = document.querySelector("#name");
  const month = document.querySelector("#month_year");
  const year = document.querySelector("#year");
  const cvc = document.querySelector("#cvc");

  cardnumber.addEventListener("input", () => {
    if (cardnumber.value.length == 16) {
      name.focus();
    }
  });

  month.addEventListener("input", () => {
    if (month.value.length == 2) {
      year.focus();
    }
  });

  year.addEventListener("input", () => {
    if (year.value.length == 2) {
      cvc.focus();
    }
  });

  cvc.addEventListener("input", () => {
    if (cvc.value.length == 3) {
      document.querySelector("#sendButton").focus();
    }
  });
}

function goBack() {
  document.querySelector("#payment").classList.add("hide");
  document.querySelector("#menu").classList.remove("hide");
  document.querySelector("header .shoppingcart").classList.remove("hide");
  document.querySelector("header .go_back").classList.add("hide");
  document.querySelector("header").classList.remove("responsive_header");
  document.querySelector(".order_txt_parent").innerHTML = "";
  remakeBasket();
}

function basketCheck(selectedBeer) {
  console.log("check basket");

  saveDataInfo(selectedBeer);

  console.log("add to basket", selectedBeer);

  function saveDataInfo(selectedBeer) {
    console.log("basketData i save data info", basketData);
    // sends the beerName to basketData
    basketData.push(selectedBeer);
    //adds the selected beer to basket
    addToBasket(selectedBeer);
    //show number of beers in basket
    let showNumberInBasket = document.querySelector(".number_in_basket");
    showNumberInBasket.textContent = `${basketData.length}`;
    basketStatus();
  }
}
// when going back from order screen to the basket, it has to remake itself from the updated basketData
function remakeBasket() {
  console.log("remakeBasket");
  console.log("remakeBasket", basketData);
  basketStatus();
  //find out beer is in basket
  prepareElHefe();
  prepareFairy();
  prepareGithop();
  prepareHollaBack();
  prepareHoppily();
  prepareMowntime();
  prepareRow();
  prepareRuinedChildhood();
  prepareSleighride();
  prepareSteampunk();

  function prepareElHefe() {
    const prepElHefe = basketData.filter((beer) => beer.beerName === "El Hefe");

    if (prepElHefe.length > 0) {
      console.log("hæhæhæh el hefe");
      const selectedBeerForBasket = prepElHefe[prepElHefe.length - 1];
      const numberOfBeerBasket = prepElHefe.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareFairy() {
    const prepFairy = basketData.filter(
      (beer) => beer.beerName === "Fairy Tale Ale"
    );

    if (prepFairy.length > 0) {
      console.log("hæhæhæh fairy");
      const selectedBeerForBasket = prepFairy[prepFairy.length - 1];
      // const selectedBeerForBasket = prepFairy;

      const numberOfBeerBasket = prepFairy.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareGithop() {
    const prepGithop = basketData.filter((beer) => beer.beerName === "GitHop");
    if (prepGithop.length > 0) {
      console.log("hæhæhæh githop");
      const selectedBeerForBasket = prepGithop[prepGithop.length - 1];
      const numberOfBeerBasket = prepGithop.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareHollaBack() {
    const prepHollaBack = basketData.filter(
      (beer) => beer.beerName === "Hollaback Lager"
    );
    if (prepHollaBack.length > 0) {
      console.log("hæhæhæh Hollaback Lager");
      const selectedBeerForBasket = prepHollaBack[prepHollaBack.length - 1];

      const numberOfBeerBasket = prepHollaBack.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareHoppily() {
    const prepHoppily = basketData.filter(
      (beer) => beer.beerName === "Hoppily Ever After"
    );
    if (prepHoppily.length > 0) {
      console.log("hæhæhæh Hoppily Ever After");
      const selectedBeerForBasket = prepHoppily[prepHoppily.length - 1];
      const numberOfBeerBasket = prepHoppily.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }

  function prepareMowntime() {
    const prepMowntime = basketData.filter(
      (beer) => beer.beerName === "Mowintime"
    );
    if (prepMowntime.length > 0) {
      console.log("hæhæhæh Mowintime");
      const selectedBeerForBasket = prepMowntime[prepMowntime.length - 1];
      const numberOfBeerBasket = prepMowntime.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }

  function prepareRow() {
    const prepRow = basketData.filter((beer) => beer.beerName === "Row 26");
    if (prepRow.length > 0) {
      console.log("hæhæhæh Row 26");
      const selectedBeerForBasket = prepRow[prepRow.length - 1];

      const numberOfBeerBasket = prepRow.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }

  function prepareRuinedChildhood() {
    const prepRuinedChildhood = basketData.filter(
      (beer) => beer.beerName === "Ruined Childhood"
    );
    if (prepRuinedChildhood.length > 0) {
      console.log("hæhæhæh Ruined Childhood");

      const selectedBeerForBasket = prepRuinedChildhood[prepRuinedChildhood.length - 1];


      const numberOfBeerBasket = prepRuinedChildhood.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }

  function prepareSleighride() {
    const prepSleighride = basketData.filter(
      (beer) => beer.beerName === "Sleighride"
    );
    if (prepSleighride.length > 0) {
      console.log("hæhæhæh Sleighride");
      const selectedBeerForBasket = prepSleighride[prepSleighride.length - 1];

      const numberOfBeerBasket = prepSleighride.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareSteampunk() {
    const prepSteampunk = basketData.filter(
      (beer) => beer.beerName === "Steampunk"
    );
    if (prepSteampunk.length > 0) {
      const selectedBeerForBasket = prepSteampunk[prepSteampunk.length - 1];

      const numberOfBeerBasket = prepSteampunk.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
}

function addToBasket(selectedBeer) {
  // // objects for basket
  // name out of selected beer
  const selectedBeerForBasket = selectedBeer;
  console.log("selected", selectedBeer);
  let classNameBeer = selectedBeerForBasket.beerName
    .replaceAll(" ", "_")
    .toLowerCase();

  let otherBeersInBasket = basketData.filter(
    (beer) => beer.beerName === selectedBeer.beerName
  );
  let numberOfBeerBasket = otherBeersInBasket.length;
  //number of beers in basket
  const quantity = document.createElement("p");
  quantity.classList.add("quantity");
  quantity.classList.add(`${classNameBeer}`);

  // div for details, + and number of beers, - and price
  const detailsCont = document.createElement("div");
  detailsCont.classList.add("details_container");
  // div for each added beer to the basket
  const basketTxtCont = document.createElement("div");
  basketTxtCont.classList.add("basket_order_cont");
  basketTxtCont.classList.add(`${classNameBeer}`);
  //price
  const price = document.createElement("p");
  price.classList.add("price");
  price.classList.add(`${classNameBeer}`);
  const priceValue = 50;

  const plus = document.createElement("p");
  plus.classList.add("quant_border");
  plus.classList.add(`${classNameBeer}_plus`);

  const minus = document.createElement("p");
  minus.classList.add("quant_border");
  minus.classList.add(`${classNameBeer}_minus`);

  // if there is another beer of the same type it changes the number of beers and price value
  if (numberOfBeerBasket > 1 && basketData.includes(selectedBeerForBasket)) {

    document.querySelector(`.price.${classNameBeer}`).textContent = `${priceValue * numberOfBeerBasket},-`;


    document.querySelector(
      `.quantity.${classNameBeer}`
    ).textContent = `${numberOfBeerBasket}`;
  } else {
    // beer name on list and puttet inside the basket container in the basket
    const p = document.createElement("p");
    p.classList.add("beer_name_class");
    p.textContent = `${selectedBeerForBasket.beerName}`;
    basketTxtCont.append(p);

    // minus to minus one beer at a time beer inside the details container
    minus.textContent = "-";
    detailsCont.append(minus);

    quantity.textContent = `${numberOfBeerBasket}`;
    detailsCont.append(quantity);

    // plus to add more beers inside the details container
    plus.textContent = "+";
    detailsCont.append(plus);

    // price tag
    price.textContent = `${priceValue * numberOfBeerBasket},-`;
    detailsCont.append(price);

    basketTxtCont.append(detailsCont);
    // puts the div with each beer type on the list
    document.querySelector(".basket_items").append(basketTxtCont);
  }
  registerPlusAndMinusButtons(selectedBeerForBasket, classNameBeer);
}

function remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket) {
  // // objects for basket
  // name out of selected beer

  console.log("selected", selectedBeerForBasket);
  let classNameBeer = selectedBeerForBasket.beerName
    .replaceAll(" ", "_")
    .toLowerCase();

  //number of beers in basket
  const quantity = document.createElement("p");
  quantity.classList.add("quantity");
  quantity.classList.add(`${classNameBeer}`);

  // div for details, + and number of beers, - and price
  const detailsCont = document.createElement("div");
  detailsCont.classList.add("details_container");
  // div for each added beer to the basket
  const basketTxtCont = document.createElement("div");
  basketTxtCont.classList.add("basket_order_cont");
  basketTxtCont.classList.add(`${classNameBeer}`);
  //price
  const price = document.createElement("p");
  price.classList.add("price");
  price.classList.add(`${classNameBeer}`);
  const priceValue = 50;

  const plus = document.createElement("p");
  plus.classList.add("quant_border");
  plus.classList.add(`${classNameBeer}_plus`);

  const minus = document.createElement("p");
  minus.classList.add("quant_border");
  minus.classList.add(`${classNameBeer}_minus`);

  // beer name on list and puttet inside the basket container in the basket
  const p = document.createElement("p");
  p.classList.add("beer_name_class");
  p.textContent = `${selectedBeerForBasket.beerName}`;
  basketTxtCont.append(p);

  // minus to minus one beer at a time beer inside the details container
  minus.textContent = "-";
  detailsCont.append(minus);

  quantity.textContent = `${numberOfBeerBasket}`;
  detailsCont.append(quantity);

  // plus to add more beers inside the details container
  plus.textContent = "+";
  detailsCont.append(plus);

  // price tag

  price.textContent = `${priceValue * numberOfBeerBasket},-`;
  detailsCont.append(price);

  basketTxtCont.append(detailsCont);
  // puts the div with each beer type on the list
  document.querySelector(".basket_items").append(basketTxtCont);

  registerPlusAndMinusButtons(selectedBeerForBasket, classNameBeer);

  //show number of beers in basket
  let showNumberInBasket = document.querySelector(".number_in_basket");
  showNumberInBasket.textContent = `${basketData.length}`;
  basketStatus();
}
function plusBeerInBasket(beerName) {
  console.log("plusBeer In Basket");
  const selectedBeer = beerName;
  const priceValue = 50;
  basketData.push(selectedBeer);
  //updates the number of each beer in basket
  let other = basketData.filter(
    (beer) => beer.beerName === selectedBeer.beerName
  );
  let numberOfBeer = other.length;
  let classNameBeer = selectedBeer.beerName.replaceAll(" ", "_").toLowerCase();

  //change the number of beers in basket from new basket data
  document.querySelector(
    `.quantity.${classNameBeer}`
  ).textContent = `${numberOfBeer}`;
  // Price of beers in basket

  document.querySelector(`.price.${classNameBeer}`).textContent = `${priceValue * numberOfBeer},-`;


  //show number of beers in basket
  let showNumberInBasket = document.querySelector(".number_in_basket");
  showNumberInBasket.textContent = `${basketData.length}`;
  basketStatus();
}

function minusBeerFromBasket(beerName) {
  console.log("minusBeerFromBasket");
  const selectedBeer = beerName;
  const priceValue = 50;
  //take the beer from basket data
  basketData.splice(
    basketData.findIndex((a) => a.beerName === selectedBeer.beerName),
    1
  );
  //updates the number of each beer in basket
  let other = basketData.filter(
    (beer) => beer.beerName === selectedBeer.beerName
  );
  let numberOfBeer = other.length;
  let classNameBeer = selectedBeer.beerName.replaceAll(" ", "_").toLowerCase();

  if (numberOfBeer <= 0) {
    console.log("less than one in basket");
    document.querySelector(`.basket_order_cont.${classNameBeer}`).remove();
  } else {
    //change the number of beers in basket from new basket data
    document.querySelector(
      `.quantity.${classNameBeer}`
    ).textContent = `${numberOfBeer}`;
    // Price of beers in basket

    document.querySelector(`.price.${classNameBeer}`).textContent = `${priceValue * numberOfBeer},-`;

  }

  //show number of beers in basket
  let showNumberInBasket = document.querySelector(".number_in_basket");
  showNumberInBasket.textContent = `${basketData.length}`;
  basketStatus();

  console.log("basket lenght", basketData.length);
}
function registerPlusAndMinusButtons(beerName, classNameBeer) {
  console.log("register plus and minus buttons");
  console.log("register button class name beer", classNameBeer);
  document
    .querySelector(`.quant_border.${classNameBeer}_plus`)
    .addEventListener("click", plusClicked);
  document
    .querySelector(`.quant_border.${classNameBeer}_minus`)
    .addEventListener("click", minusClicked);
}

function plusClicked(event) {
  let classNameOfBeer = event.target.classList[1];
  let className = event.target.classList[0];
  if (className === "quant_border") {
    plusBeerBasket(classNameOfBeer);
  } else {
    plusBeerOrder(classNameOfBeer);
  }
}
function minusClicked(event) {
  let classNameOfBeer = event.target.classList[1];
  let className = event.target.classList[0];

  if (className === "quant_border") {
    minusBeerBasket(classNameOfBeer);
  } else {
    minusBeerOrder(classNameOfBeer);
  }
}
function plusBeerBasket(classNameOfBeer) {
  console.log("plus beer in basket");
  let firstNameOfClassName = classNameOfBeer.substring(
    0,
    classNameOfBeer.indexOf("_")
  );

  if (firstNameOfClassName == "el") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "El Hefe");

    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "fairy") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Fairy Tale Ale"
    );
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "githop") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "GitHop");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "hollaback") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Hollaback Lager"
    );
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "hoppily") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Hoppily Ever After"
    );
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "mowintime") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Mowintime");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "row") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Row 26");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "ruined") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Ruined Childhood"
    );
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "sleighride") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Sleighride"
    );
    plusBeerInBasket(selectedBeer);
  } else {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Steampunk");
    plusBeerInBasket(selectedBeer);
  }
}

function minusBeerBasket(classNameOfBeer) {
  console.log("minus beer in basket");
  let firstNameOfClassName = classNameOfBeer.substring(
    0,
    classNameOfBeer.indexOf("_")
  );
  console.log("first name", firstNameOfClassName);

  if (firstNameOfClassName == "el") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "El Hefe");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "fairy") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Fairy Tale Ale"
    );
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "githop") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "GitHop");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "hollaback") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Hollaback Lager"
    );
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "hoppily") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Hoppily Ever After"
    );
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "mowintime") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Mowintime");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "row") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Row 26");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "ruined") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Ruined Childhood"
    );
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "sleighride") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Sleighride"
    );
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Steampunk");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  }
}

function prepareOrder() {
  console.log("prepare order");
  //find out beer is in basket
  prepareElHefe();
  prepareFairy();
  prepareGithop();
  prepareHollaBack();
  prepareHoppily();
  prepareMowntime();
  prepareRow();
  prepareRuinedChildhood();
  prepareSleighride();
  prepareSteampunk();
  function prepareElHefe() {
    const prepElHefe = basketData.filter((beer) => beer.beerName === "El Hefe");

    if (prepElHefe.length > 0) {
      const selectedBeerForOrder = prepElHefe[prepElHefe.length - 1];

      const numberOfBeerOrder = prepElHefe.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
  function prepareFairy() {
    const prepFairy = basketData.filter(
      (beer) => beer.beerName === "Fairy Tale Ale"
    );

    if (prepFairy.length > 0) {
      const selectedBeerForOrder = prepFairy[prepFairy.length - 1];

      const numberOfBeerOrder = prepFairy.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
  function prepareGithop() {
    const prepGithop = basketData.filter((beer) => beer.beerName === "GitHop");
    if (prepGithop.length > 0) {
      const selectedBeerForOrder = prepGithop[prepGithop.length - 1];

      const numberOfBeerOrder = prepGithop.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
  function prepareHollaBack() {
    const prepHollaBack = basketData.filter(
      (beer) => beer.beerName === "Hollaback Lager"
    );
    if (prepHollaBack.length > 0) {
      const selectedBeerForOrder = prepHollaBack[prepHollaBack.length - 1];

      const numberOfBeerOrder = prepHollaBack.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
  function prepareHoppily() {
    const prepHoppily = basketData.filter(
      (beer) => beer.beerName === "Hoppily Ever After"
    );
    if (prepHoppily.length > 0) {
      const selectedBeerForOrder = prepHoppily[prepHoppily.length - 1];

      const numberOfBeerOrder = prepHoppily.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }

  function prepareMowntime() {
    const prepMowntime = basketData.filter(
      (beer) => beer.beerName === "Mowintime"
    );
    if (prepMowntime.length > 0) {
      const selectedBeerForOrder = prepMowntime[prepMowntime.length - 1];

      const numberOfBeerOrder = prepMowntime.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }

  function prepareRow() {
    const prepRow = basketData.filter((beer) => beer.beerName === "Row 26");
    if (prepRow.length > 0) {
      const selectedBeerForOrder = prepRow[prepRow.length - 1];

      const numberOfBeerOrder = prepRow.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }

  function prepareRuinedChildhood() {
    const prepRuinedChildhood = basketData.filter(
      (beer) => beer.beerName === "Ruined Childhood"
    );
    if (prepRuinedChildhood.length > 0) {
      const selectedBeerForOrder =
        prepRuinedChildhood[prepRuinedChildhood.length - 1];

      const numberOfBeerOrder = prepRuinedChildhood.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }

  function prepareSleighride() {
    const prepSleighride = basketData.filter(
      (beer) => beer.beerName === "Sleighride"
    );
    if (prepSleighride.length > 0) {
      const selectedBeerForOrder = prepSleighride[prepSleighride.length - 1];

      const numberOfBeerOrder = prepSleighride.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
  function prepareSteampunk() {
    const prepSteampunk = basketData.filter(
      (beer) => beer.beerName === "Steampunk"
    );
    if (prepSteampunk.length > 0) {
      const selectedBeerForOrder = prepSteampunk[prepSteampunk.length - 1];

      const numberOfBeerOrder = prepSteampunk.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
}
function addToOrder(selectedBeerForOrder, numberOfBeerOrder) {
  console.log("add to order");

  let classNameBeer = selectedBeerForOrder.beerName
    .replaceAll(" ", "_")
    .toLowerCase();
  console.log("classNameBeer", classNameBeer);

  const quantity = document.createElement("p");
  quantity.classList.add("quantity_order");
  quantity.classList.add(`${classNameBeer}`);

  // // div for details, + and number of beers, - and price
  const detailsCont = document.createElement("div");
  detailsCont.classList.add("details_container_order");
  // // div for each added beer to the basket
  // for x to delete all item all one
  const x = document.createElement("p");
  x.classList.add("x");
  x.classList.add(`${classNameBeer}`);
  x.textContent = "x";

  const orderTxtCont = document.createElement("div");
  orderTxtCont.classList.add("basket_order_cont_order");
  orderTxtCont.classList.add(`${classNameBeer}`);
  // //price
  const price = document.createElement("p");
  price.classList.add("price_order");
  price.classList.add(`${classNameBeer}`);
  const priceValue = 50;

  const minus = document.createElement("p");
  minus.classList.add("quant_border_order");
  minus.classList.add(`${classNameBeer}_minus`);

  const plus = document.createElement("p");
  plus.classList.add("quant_border_order");
  plus.classList.add(`${classNameBeer}_plus`);

  const p = document.createElement("p");
  p.classList.add("beer_order_name");
  p.textContent = `${selectedBeerForOrder.beerName}`;
  orderTxtCont.append(x);
  orderTxtCont.append(p);

  //   // minus to minus one beer at a time beer inside the details container
  minus.textContent = "-";
  detailsCont.append(minus);
  //updates the number of each beer in basket
  quantity.textContent = `${numberOfBeerOrder}`;
  detailsCont.append(quantity);

  //   // plus to add more beers inside the details container

  plus.textContent = "+";
  detailsCont.append(plus);

  //   // price tag

  price.textContent = `${priceValue * numberOfBeerOrder},-`;

  detailsCont.append(price);
  //   // puts the div with each beer type on the list
  orderTxtCont.append(detailsCont);

  document.querySelector(".order_txt_parent").append(orderTxtCont);
  let amountOfBeers = basketData.length;
  let totalAmount = amountOfBeers * priceValue;
  document.querySelector(".total_amount").textContent = `${totalAmount},-`;
  registerPlusAndMinusButtonsOrder(classNameBeer);
}

function registerPlusAndMinusButtonsOrder(classNameBeer) {
  console.log("register plus and minus buttons");
  console.log("register button class name beer", classNameBeer);

  document
    .querySelector(`.quant_border_order.${classNameBeer}_minus`)
    .addEventListener("click", minusClicked);
  document
    .querySelector(`.quant_border_order.${classNameBeer}_plus`)
    .addEventListener("click", plusClicked);
  document
    .querySelector(`.x.${classNameBeer}`)
    .addEventListener("click", xClicked);
}
function xClicked(event) {
  let classNameOfBeer = event.target.classList[1];
  removeBeer(classNameOfBeer);
}
function removeBeer(classNameOfBeer) {
  console.log("remove beer in order", classNameOfBeer);

  if (classNameOfBeer == "el_hefe") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "El Hefe");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "fairy_tale_ale") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Fairy Tale Ale"
    );
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "githop") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "GitHop");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "hollaback_lager") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Hollaback Lager"
    );
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "hoppily_ever_after") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Hoppily Ever After"
    );
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "mowintime") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Mowintime"
    );
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "row_26") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Row 26");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "ruined_childhood") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Ruined Childhood"
    );
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "sleighride") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Sleighride"
    );
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "steampunk") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Steampunk"
    );
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else {
    console.log("not finding any");
  }
}
function removeBeerFromOrder(beerName) {
  const orderBeerName = beerName;
  console.log("remove", orderBeerName);
  let classNameBeer = orderBeerName.beerName.replaceAll(" ", "_").toLowerCase();
  console.log("remove classname", classNameBeer);

  document.querySelector(`.basket_order_cont_order.${classNameBeer}`).remove();

  let other = basketData.filter(
    (beer) => beer.beerName === orderBeerName.beerName
  );
  let numberOfBeer = other.length;
  basketData.splice(
    basketData.findIndex((a) => a.beerName === orderBeerName.beerName),
    numberOfBeer
  );
  let amountOfBeers = basketData.length;
  let totalAmount = amountOfBeers * 50;

  document.querySelector(".total_amount").textContent = `${totalAmount},-`;
}
function minusBeerOrder(classNameOfBeer) {
  console.log("minus beer in order");
  let firstNameOfClassName = classNameOfBeer.substring(
    0,
    classNameOfBeer.indexOf("_")
  );
  console.log("first name", firstNameOfClassName);
  // TO DO: push another selected beer to basketData and override quantity

  if (firstNameOfClassName == "el") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "El Hefe");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "fairy") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Fairy Tale Ale"
    );
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "githop") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "GitHop");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "hollaback") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Hollaback Lager"
    );
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "hoppily") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Hoppily Ever After"
    );
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "mowintime") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Mowintime"
    );
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "row") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Row 26");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "ruined") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Ruined Childhood"
    );
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "sleighride") {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Sleighride"
    );
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else {
    const orderBeerName = allBeers.find(
      (beer) => beer.beerName === "Steampunk"
    );
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  }
}

function minusBeerFromOrder(beerName) {
  console.log("minusBeerFromOrder");
  const orderBeerName = beerName;
  const priceValue = 50;

  basketData.splice(
    basketData.findIndex((a) => a.beerName === orderBeerName.beerName),
    1
  );
  //updates the number of each beer in basket
  let other = basketData.filter(
    (beer) => beer.beerName === orderBeerName.beerName
  );
  let numberOfBeer = other.length;
  let classNameBeer = orderBeerName.beerName.replaceAll(" ", "_").toLowerCase();

  if (numberOfBeer <= 0) {
    console.log("less than one in basket");
    document
      .querySelector(`.basket_order_cont_order.${classNameBeer}`)
      .remove();
  } else {
    //change the number of beers in basket from new basket data
    document.querySelector(
      `.quantity_order.${classNameBeer}`
    ).textContent = `${numberOfBeer}`;
    // Price of beers in basket

    document.querySelector(`.price_order.${classNameBeer}`).textContent = `${priceValue * numberOfBeer},-`;

  }

  let amountOfBeers = basketData.length;
  let totalAmount = amountOfBeers * priceValue;

  document.querySelector(".total_amount").textContent = `${totalAmount},-`;
}
function plusBeerOrder(classNameOfBeer) {
  console.log("plus beer in basket");

  let firstNameOfClassName = classNameOfBeer.substring(
    0,
    classNameOfBeer.indexOf("_")
  );

  // TO DO: push another selected beer to basketData and override quantity

  if (firstNameOfClassName == "el") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "El Hefe");
    console.log("first name of calss", firstNameOfClassName);
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "fairy") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Fairy Tale Ale"
    );
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "githop") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "GitHop");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "hollaback") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Hollaback Lager"
    );
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "hoppily") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Hoppily Ever After"
    );
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "mowintime") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Mowintime");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "row") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Row 26");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "ruined") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Ruined Childhood"
    );
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "sleighride") {
    const selectedBeer = allBeers.find(
      (beer) => beer.beerName === "Sleighride"
    );
    plusBeerInOrder(selectedBeer);
  } else {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Steampunk");
    plusBeerInOrder(selectedBeer);
  }
}
function plusBeerInOrder(beerName) {
  console.log("plusBeer In Basket");
  const selectedBeer = beerName;
  const priceValue = 50;
  basketData.push(selectedBeer);
  //updates the number of each beer in basket
  let other = basketData.filter(
    (beer) => beer.beerName === selectedBeer.beerName
  );
  let numberOfBeer = other.length;
  let classNameBeer = selectedBeer.beerName.replaceAll(" ", "_").toLowerCase();

  //change the number of beers in basket from new basket data
  document.querySelector(
    `.quantity_order.${classNameBeer}`
  ).textContent = `${numberOfBeer}`;
  // Price of beers in basket

  document.querySelector(`.price_order.${classNameBeer}`).textContent = `${priceValue * numberOfBeer},-`;


  let amountOfBeers = basketData.length;
  let totalAmount = amountOfBeers * priceValue;

  document.querySelector(".total_amount").textContent = `${totalAmount},-`;
}
///PAYMENT

function registerPayment() {
  document.querySelector(".card").addEventListener("click", payWithCard);
  document.querySelector(".pay").addEventListener("click", (e) => {
    e.preventDefault();

    console.log("submit clicked");

    //Check if the form is valid
    const isValid = checkValidation();

    console.log("isValid", isValid);

    if (isValid) {
      console.log("valid");

      const OrderData = createObject();
      post(OrderData);
    }
  });
}

function createObject() {
  const order = [];

  basketData.forEach((item) => {
    if (order.length == 0) {
      let beer = {
        name: item.beerName,
        amount: 1,
      };
      order.push(beer);
    } else {
      let beerisfound = false;

      order.forEach((beer) => {
        if (beer.name == item.beerName) {
          beerisfound = true;
        }
      });

      if (beerisfound) {
        order.forEach((beer) => {
          if (beer.name == item.beerName) {
            beer.amount++;
          }
        });
      } else {
        let beer = {
          name: item.beerName,
          amount: 1,
        };
        order.push(beer);
      }
    }
  });

  return order;
}

function payWithCard() {
  const cardFillout = document.querySelector(".card_payment");

  if (cardFillout.classList.contains("hide")) {
    cardFillout.classList.remove("hide");
  } else {
    cardFillout.classList.add("hide");
  }
}

//Missing to go back
function goToReceipt(data) {
  const id = data.id;
  document.querySelector("#your-order").textContent = id;
  document.querySelector("#payment").classList.add("hide");
  document.querySelector("#receipt").classList.remove("hide");
  document.querySelector(".go_back").style.visibility = "hidden";
}

function post(data) {
  const postData = JSON.stringify(data);
  console.log("order", data);
  fetch("https://groupfoobar.herokuapp.com/order", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },

    body: postData,
  })
    .then((res) => res.json())

    .then((idData) => {
      goToReceipt(idData);

      createTheOrder(data);
    });

  //get();
}
function createTheOrder(data) {
  console.log("create the order");
  const mailOrderContainer = document.createElement("div");
  mailOrderContainer.style.display = "none";
  const userName = document.getElementById("name").value;
  const firstNameUser = userName.substring(0, userName.indexOf(" "));
  const surName = document.createElement("p");
  surName.classList.add("surname");
  surName.style.display = "none";
  surName.textContent = `${firstNameUser}`;
  document.querySelector("#receipt").appendChild(surName);
  mailOrderContainer.id = "mail_order_container";
  document.querySelector("#receipt").appendChild(mailOrderContainer);

  data.forEach((order) => {
    const mailOrderAmount = document.createElement("p");
    mailOrderAmount.classList.add("mail_order_amount");
    mailOrderAmount.textContent = `        ${order.amount}x `;
    mailOrderContainer.append(mailOrderAmount);

    const mailOrderName = document.createElement("p");
    mailOrderName.classList.add("mail_order_name");
    mailOrderName.textContent = `  ${order.name}    `;
    mailOrderContainer.append(mailOrderName);
  });
  sendMail(data);
}

function sendMail(data) {
  console.log("data", data);
  let dataLenght = data.length;
  console.log("data length", dataLenght);

  const mailTemplate = {
    id_number: document.querySelector("#your-order").textContent,
    first_name: document.querySelector(".surname").textContent,
    email_to: document.getElementById("mail").value,
    message: document.querySelector("#mail_order_container").textContent,
  };

  emailjs
    .send("service_m4us0sl", "template_l9e40k3", mailTemplate)
    .then(function (res) {
      console.log("success", res.status);
    });
}

function registerValidation() {
  document.querySelector("#mail").addEventListener("change", validateMail);
  document
    .querySelector("#cardNumber")
    .addEventListener("change", validateCardnumber);

  document
    .querySelector("#month_year")
    .addEventListener("change", validateMonth);

  document.querySelector("#year").addEventListener("change", validateYear);

  document.querySelector("#cvc").addEventListener("change", validateCVC);

  document.querySelector("#name").addEventListener("change", validateName);
}

function validateMail() {
  const mail = document.querySelector("#mail");

  const error = document.querySelector("#email-error");

  //Hide previus shown errors
  if (!error.classList.contains("hide")) {
    error.classList.add("hide");
  }

  //Show apropriet errors
  if (!mail.checkValidity()) {
    error.classList.remove("hide");
    mail.classList.add("invalid");

    validation.mail = false;
  } else {
    validation.mail = true;
  }
}

function validateName() {
  const name = document.querySelector("#name");

  const error1 = document.querySelector("#name-error1");

  //Hide previus shown errors
  if (!error1.classList.contains("hide")) {
    error1.classList.add("hide");
  }

  //Validate input
  if (!name.checkValidity()) {
    error1.classList.remove("hide");
    name.classList.add("invalid");

    validation.name = false;
  } else {
    validation.name = true;
  }
}

function validateCardnumber() {
  const cardnumber = document.querySelector("#cardNumber");

  const error1 = document.querySelector("#card-error1");
  const error2 = document.querySelector("#card-error2");
  const error3 = document.querySelector("#card-error3");

  const regVisa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");

  //Remove previusly shown errors
  if (!error1.classList.contains("hide")) {
    error1.classList.add("hide");
  }
  if (!error2.classList.contains("hide")) {
    error2.classList.add("hide");
  }
  if (!error3.classList.contains("hide")) {
    error3.classList.add("hide");
  }

  //Validate input
  if (!cardnumber.checkValidity()) {
    error3.classList.remove("hide");
    cardnumber.classList.add("invalid");

    validation.cardnumber = false;
  } else if (cardnumber.value.length < 16 || cardnumber.value.length > 16) {
    error1.classList.remove("hide");
    cardnumber.classList.add("invalid");

    validation.cardnumber = false;
  } else if (!regVisa.test(cardnumber.value)) {
    error2.classList.remove("hide");
    cardnumber.classList.add("invalid");

    validation.cardnumber = false;
  } else {
    if (cardnumber.classList.contains("invalid")) {
      cardnumber.classList.remove("invalid");
    }
    validation.cardnumber = true;
  }
}

function validateMonth() {
  const month = document.querySelector("#month_year");

  const error1 = document.querySelector("#month-year-error1");
  const error2 = document.querySelector("#month-year-error3");
  const error3 = document.querySelector("#month-year-error2");

  //Remove previusly shown errors
  if (!error1.classList.contains("hide")) {
    error1.classList.add("hide");
  }
  if (!error2.classList.contains("hide")) {
    error2.classList.add("hide");
  }

  //Validate input
  if (!month.checkValidity()) {
    error3.classList.remove("hide");
    month.classList.add("invalid");

    validation.month = false;
  } else if (month.value.length < 2 || month.value.length > 2) {
    error2.classList.remove("hide");
    month.classList.add("invalid");

    validation.month = false;
  } else if (month.value.charAt(0) < 0 || month.value.charAt(0) > 1) {
    error1.classList.remove("hide");
    month.classList.add("invalid");

    validation.month = false;
  } else if (month.value <= 0 || month.value > 12) {
    error1.classList.remove("hide");
    month.classList.add("invalid");

    validation.month = false;
  } else {
    if (month.classList.contains("invalid")) {
      month.classList.remove("invalid");
    }
    validation.month = true;
  }
}

function validateYear() {
  const year = document.querySelector("#year");

  const error1 = document.querySelector("#month-year-error4");
  const error2 = document.querySelector("#month-year-error5");
  const error3 = document.querySelector("#month-year-error2");

  const now = new Date();
  const thisYear = now.getFullYear();
  const yearString = thisYear.toString();

  //Remove previusly shown errors
  if (!error1.classList.contains("hide")) {
    error1.classList.add("hide");
  }
  if (!error2.classList.contains("hide")) {
    error2.classList.add("hide");
  }

  //Validate input
  if (!year.checkValidity()) {
    error3.classList.remove("hide");
    year.classList.add("invalid");

    validation.year = false;
  } else if (year.value.length < 2 || year.value.length > 2) {
    error1.classList.remove("hide");
    year.classList.add("invalid");

    validation.year = false;
  } else if (year.value < yearString.substring(2)) {
    error2.classList.remove("hide");
    year.classList.add("invalid");

    validation.year = false;
  } else {
    if (year.classList.contains("invalid")) {
      year.classList.remove("invalid");
    }
    validation.year = true;
  }
}

function validateCVC() {
  const cvc = document.querySelector("#cvc");

  const error1 = document.querySelector("#cvc-error1");
  const error2 = document.querySelector("#cvc-error2");

  //Remove previusly shown errors
  if (!error1.classList.contains("hide")) {
    error1.classList.add("hide");
  }
  if (!error2.classList.contains("hide")) {
    error2.classList.add("hide");
  }

  if (!cvc.checkValidity()) {
    error2.classList.remove("hide");
    cvc.classList.add("invalid");

    validation.cvc = false;
  } else if (cvc.value.length < 3 || cvc.value.length > 3) {
    error1.classList.remove("hide");
    cvc.classList.add("invalid");

    validation.cvc = false;
  } else {
    if (cvc.classList.contains("invalid")) {
      cvc.classList.remove("invalid");
    }
    validation.cvc = true;
  }
}

function checkValidation() {
  console.log(validation);

  if (validation.mail === false) {
    validateMail();
  }

  if (document.querySelector(".card_payment").classList.contains("hide")) {
    document.querySelector("#payment-error").classList.remove("hide");
  } else {
    if (!document.querySelector("#payment-error").classList.contains("hide")) {
      document.querySelector("#payment-error").classList.add("hide");
    }

    if (validation.cardnumber === false) {
      validateCardnumber();
    }

    if (validation.name === false) {
      validateName();
    }

    if (validation.month === false) {
      validateMonth();
    }

    if (validation.year === false) {
      validateYear();
    }

    if (validation.cvc === false) {
      validateCVC();
    }
  }

  const validated =
    Object.values(validation).filter((val) => val === false).length === 0;

  return validated;
}
