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

function init() {
  getData();
  registerButtons();
  // make the basket in mobile view look empty empty basket
  fill.style.fill = "transparent";
}

function registerButtons() {
  console.log("registered buttons");
  document.querySelectorAll("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", selectFilter);
  });
  document.querySelector(".shoppingcart").addEventListener("click", showBasket);
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

//display the list of beers on menu
function displayList(beers) {
  document.querySelector("#beers").innerHTML = "";
  beers.forEach(displayBeer);
}

function displayBeer(beer) {
  const clone = document.querySelector("#beer").content.cloneNode(true);

  //Set clone data
  clone.querySelector("[data-field=imageName]").src = beer.imageName;
  //add to cart
  clone.querySelector(".add_to_cart").addEventListener("click", basketClicked);

  // basket on the mobile view was clicked
  function basketClicked() {
    basketCheck(beer);
  }
  //click to see details
  clone.querySelector(".read_more").addEventListener("click", () => showDetails(beer));

  // append clone to list

  document.querySelector("#beers").appendChild(clone);
}
function showDetails(beer) {
  document.querySelector("main").classList.add("no_scroll");
  const clone = document.querySelector("#information").cloneNode(true).content;
  popup.textContent = "";
  clone.querySelector("[data-field=imageName]").src = beer.imageName;
  clone.querySelector("[data-field=beerName]").textContent = `${beer.beerName}`;

  clone.querySelector("[data-field=aroma]").textContent = `${beer.description.aroma}`;
  clone.querySelector("[data-field=appearance]").textContent = `${beer.description.appearance}`;
  clone.querySelector("[data-field=flavor]").textContent = `${beer.description.flavor}`;
  clone.querySelector("[data-field=mouthfeel]").textContent = `${beer.description.mouthfeel}`;
  clone.querySelector("[data-field=overallImpression]").textContent = `${beer.description.overallImpression}`;
  clone.querySelector("[data-field=alc]").textContent = `${beer.alc}% Alc`;
  clone.querySelector("[data-field=price]").textContent = `50 -kr.`;

  //add to cart from the popup view
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
  document.querySelector("header .shoppingcart").classList.add("hide");
  document.querySelector("header .go_back").classList.remove("hide");

  document.querySelector("header .go_back").addEventListener("click", goBack);

  document.querySelector("header").classList.add("responsive_header");
  document.querySelector(".basket_items").innerHTML = "";
  prepareOrder();
  registerPayment();
  if (screen.width < 700) {
    closeBasket();
  } else {
  }
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

  fill.style.fill = "#eed6b3";

  document.querySelector(".basket .checkout").addEventListener("click", goToCheckout);

  function saveDataInfo(selectedBeer) {
    console.log("basketData i save data info", basketData);
    // sends the beerName to basketData
    basketData.push(selectedBeer);
    //adds the selected beer to basket
    addToBasket(selectedBeer);

    //show number of beers in basket
    let showNumberInBasket = document.querySelector(".number_in_basket");
    showNumberInBasket.textContent = `${basketData.length}`;
  }
}
// when going back from order screen to the basket, it has to remake itself from the updated basketData
function remakeBasket() {
  console.log("remakeBasket");
  console.log("remakeBasket", basketData);

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
      // const selectedBeerForBasket = prepElHefe;
      const numberOfBeerBasket = prepElHefe.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareFairy() {
    const prepFairy = basketData.filter((beer) => beer.beerName === "Fairy Tale Ale");

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
      // const selectedBeerForBasket = prepGithop;
      const numberOfBeerBasket = prepGithop.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareHollaBack() {
    const prepHollaBack = basketData.filter((beer) => beer.beerName === "Hollaback Lager");
    if (prepHollaBack.length > 0) {
      console.log("hæhæhæh Hollaback Lager");
      const selectedBeerForBasket = prepHollaBack[prepHollaBack.length - 1];
      // const selectedBeerForBasket = prepHollaBack;

      const numberOfBeerBasket = prepHollaBack.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareHoppily() {
    const prepHoppily = basketData.filter((beer) => beer.beerName === "Hoppily Ever After");
    if (prepHoppily.length > 0) {
      console.log("hæhæhæh Hoppily Ever After");
      const selectedBeerForBasket = prepHoppily[prepHoppily.length - 1];
      // const selectedBeerForBasket = prepHoppily;
      const numberOfBeerBasket = prepHoppily.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }

  function prepareMowntime() {
    const prepMowntime = basketData.filter((beer) => beer.beerName === "Mowintime");
    if (prepMowntime.length > 0) {
      console.log("hæhæhæh Mowintime");
      const selectedBeerForBasket = prepMowntime[prepMowntime.length - 1];
      // const selectedBeerForBasket = prepMowntime;
      const numberOfBeerBasket = prepMowntime.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }

  function prepareRow() {
    const prepRow = basketData.filter((beer) => beer.beerName === "Row 26");
    if (prepRow.length > 0) {
      console.log("hæhæhæh Row 26");
      const selectedBeerForBasket = prepRow[prepRow.length - 1];
      // const selectedBeerForBasket = prepRow;

      const numberOfBeerBasket = prepRow.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }

  function prepareRuinedChildhood() {
    const prepRuinedChildhood = basketData.filter((beer) => beer.beerName === "Ruined Childhood");
    if (prepRuinedChildhood.length > 0) {
      console.log("hæhæhæh Ruined Childhood");
      const selectedBeerForBasket = prepRuinedChildhood[prepRuinedChildhood.length - 1];
      // const selectedBeerForBasket = prepRuinedChildhood;

      const numberOfBeerBasket = prepRuinedChildhood.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }

  function prepareSleighride() {
    const prepSleighride = basketData.filter((beer) => beer.beerName === "Sleighride");
    if (prepSleighride.length > 0) {
      console.log("hæhæhæh Sleighride");
      const selectedBeerForBasket = prepSleighride[prepSleighride.length - 1];
      // const selectedBeerForBasket = prepSleighride;

      const numberOfBeerBasket = prepSleighride.length;

      remakeOfBasket(selectedBeerForBasket, numberOfBeerBasket);
    }
  }
  function prepareSteampunk() {
    const prepSteampunk = basketData.filter((beer) => beer.beerName === "Steampunk");
    if (prepSteampunk.length > 0) {
      const selectedBeerForBasket = prepSteampunk[prepSteampunk.length - 1];
      // const selectedBeerForBasket = prepSleighride;

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
  let classNameBeer = selectedBeerForBasket.beerName.replaceAll(" ", "_").toLowerCase();

  let otherBeersInBasket = basketData.filter((beer) => beer.beerName === selectedBeer.beerName);
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
    document.querySelector(`.price.${classNameBeer}`).textContent = `${priceValue * numberOfBeerBasket}-,`;

    document.querySelector(`.quantity.${classNameBeer}`).textContent = `${numberOfBeerBasket}`;
  } else {
    // beer name on list and puttet inside the basket container in the basket
    const p = document.createElement("p");
    p.textContent = `${selectedBeerForBasket.beerName}`;
    basketTxtCont.append(p);

    // minus to minus one beer at a time beer inside the details container
    minus.textContent = "-";
    detailsCont.append(minus);

    quantity.textContent = `${numberOfBeerBasket}`;
    detailsCont.append(quantity);

    // plus to add more beers inside the details container
    // // TO DO:
    plus.textContent = "+";
    detailsCont.append(plus);

    //basketTxtCont.append(detailsCont);
    // price tag

    price.textContent = `${priceValue * numberOfBeerBasket}-,`;
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
  let classNameBeer = selectedBeerForBasket.beerName.replaceAll(" ", "_").toLowerCase();

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
  p.textContent = `${selectedBeerForBasket.beerName}`;
  basketTxtCont.append(p);

  // minus to minus one beer at a time beer inside the details container
  minus.textContent = "-";
  detailsCont.append(minus);

  quantity.textContent = `${numberOfBeerBasket}`;
  detailsCont.append(quantity);

  // plus to add more beers inside the details container
  // // TO DO:
  plus.textContent = "+";
  detailsCont.append(plus);

  //basketTxtCont.append(detailsCont);
  // price tag

  price.textContent = `${priceValue * numberOfBeerBasket}-,`;
  detailsCont.append(price);

  basketTxtCont.append(detailsCont);
  // puts the div with each beer type on the list
  document.querySelector(".basket_items").append(basketTxtCont);

  registerPlusAndMinusButtons(selectedBeerForBasket, classNameBeer);

  //show number of beers in basket
  let showNumberInBasket = document.querySelector(".number_in_basket");
  showNumberInBasket.textContent = `${basketData.length}`;
}
function plusBeerInBasket(beerName) {
  console.log("plusBeer In Basket");
  const selectedBeer = beerName;
  const priceValue = 50;
  basketData.push(selectedBeer);
  //updates the number of each beer in basket
  let other = basketData.filter((beer) => beer.beerName === selectedBeer.beerName);
  let numberOfBeer = other.length;
  let classNameBeer = selectedBeer.beerName.replaceAll(" ", "_").toLowerCase();

  //change the number of beers in basket from new basket data
  document.querySelector(`.quantity.${classNameBeer}`).textContent = `${numberOfBeer}`;
  // Price of beers in basket
  document.querySelector(`.price.${classNameBeer}`).textContent = `${priceValue * numberOfBeer}-,`;

  //show number of beers in basket
  let showNumberInBasket = document.querySelector(".number_in_basket");
  showNumberInBasket.textContent = `${basketData.length}`;
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
  let other = basketData.filter((beer) => beer.beerName === selectedBeer.beerName);
  let numberOfBeer = other.length;
  let classNameBeer = selectedBeer.beerName.replaceAll(" ", "_").toLowerCase();

  if (numberOfBeer <= 0) {
    console.log("less than one in basket");
    document.querySelector(`.basket_order_cont.${classNameBeer}`).remove();
  } else {
    //change the number of beers in basket from new basket data
    document.querySelector(`.quantity.${classNameBeer}`).textContent = `${numberOfBeer}`;
    // Price of beers in basket
    document.querySelector(`.price.${classNameBeer}`).textContent = `${priceValue * numberOfBeer}-,`;
  }

  //show number of beers in basket
  let showNumberInBasket = document.querySelector(".number_in_basket");
  showNumberInBasket.textContent = `${basketData.length}`;
}
function registerPlusAndMinusButtons(beerName, classNameBeer) {
  console.log("register plus and minus buttons");
  console.log("register button class name beer", classNameBeer);
  document.querySelector(`.quant_border.${classNameBeer}_plus`).addEventListener("click", plusClicked);
  document.querySelector(`.quant_border.${classNameBeer}_minus`).addEventListener("click", minusClicked);
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
  let firstNameOfClassName = classNameOfBeer.substring(0, classNameOfBeer.indexOf("_"));

  if (firstNameOfClassName == "el") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "El Hefe");

    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "fairy") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Fairy Tale Ale");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "githop") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "GitHop");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "hollaback") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Hollaback Lager");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "hoppily") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Hoppily Ever After");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "mowintime") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Mowintime");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "row") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Row 26");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "ruined") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Ruined Childhood");
    plusBeerInBasket(selectedBeer);
  } else if (firstNameOfClassName == "sleighride") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Sleighride");
    plusBeerInBasket(selectedBeer);
  } else {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Steampunk");
    plusBeerInBasket(selectedBeer);
  }
}

function minusBeerBasket(classNameOfBeer) {
  console.log("minus beer in basket");
  let firstNameOfClassName = classNameOfBeer.substring(0, classNameOfBeer.indexOf("_"));
  console.log("first name", firstNameOfClassName);

  if (firstNameOfClassName == "el") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "El Hefe");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "fairy") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Fairy Tale Ale");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "githop") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "GitHop");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "hollaback") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Hollaback Lager");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "hoppily") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Hoppily Ever After");
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
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Ruined Childhood");
    console.log("found", selectedBeer);
    minusBeerFromBasket(selectedBeer);
  } else if (firstNameOfClassName == "sleighride") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Sleighride");
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
    const prepFairy = basketData.filter((beer) => beer.beerName === "Fairy Tale Ale");

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
    const prepHollaBack = basketData.filter((beer) => beer.beerName === "Hollaback Lager");
    if (prepHollaBack.length > 0) {
      const selectedBeerForOrder = prepHollaBack[prepHollaBack.length - 1];

      const numberOfBeerOrder = prepHollaBack.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
  function prepareHoppily() {
    const prepHoppily = basketData.filter((beer) => beer.beerName === "Hoppily Ever After");
    if (prepHoppily.length > 0) {
      const selectedBeerForOrder = prepHoppily[prepHoppily.length - 1];

      const numberOfBeerOrder = prepHoppily.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }

  function prepareMowntime() {
    const prepMowntime = basketData.filter((beer) => beer.beerName === "Mowintime");
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
    const prepRuinedChildhood = basketData.filter((beer) => beer.beerName === "Ruined Childhood");
    if (prepRuinedChildhood.length > 0) {
      const selectedBeerForOrder = prepRuinedChildhood[prepRuinedChildhood.length - 1];

      const numberOfBeerOrder = prepRuinedChildhood.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }

  function prepareSleighride() {
    const prepSleighride = basketData.filter((beer) => beer.beerName === "Sleighride");
    if (prepSleighride.length > 0) {
      const selectedBeerForOrder = prepSleighride[prepSleighride.length - 1];

      const numberOfBeerOrder = prepSleighride.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
  function prepareSteampunk() {
    const prepSteampunk = basketData.filter((beer) => beer.beerName === "Steampunk");
    if (prepSteampunk.length > 0) {
      const selectedBeerForOrder = prepSteampunk[prepSteampunk.length - 1];

      const numberOfBeerOrder = prepSteampunk.length;

      addToOrder(selectedBeerForOrder, numberOfBeerOrder);
    }
  }
}
function addToOrder(selectedBeerForOrder, numberOfBeerOrder) {
  console.log("add to order");

  let classNameBeer = selectedBeerForOrder.beerName.replaceAll(" ", "_").toLowerCase();
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
  //document.querySelector(`.quantity_order.${classNameBeer}`).textContent = `${numberOfBeer}`;

  quantity.textContent = `${numberOfBeerOrder}`;
  detailsCont.append(quantity);

  //   // plus to add more beers inside the details container
  //   // // TO DO:
  plus.textContent = "+";
  detailsCont.append(plus);

  //   // price tag

  price.textContent = `${priceValue * numberOfBeerOrder}-,`;
  //price.textContent = `${priceValue}-,`;
  //document.querySelector(`.price_order.${classNameBeer}`).textContent = `${priceValue * numberOfBeer}-,`;

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

  document.querySelector(`.quant_border_order.${classNameBeer}_minus`).addEventListener("click", minusClicked);
  document.querySelector(`.quant_border_order.${classNameBeer}_plus`).addEventListener("click", plusClicked);
  document.querySelector(`.x.${classNameBeer}`).addEventListener("click", xClicked);
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
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Fairy Tale Ale");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "githop") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "GitHop");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "hollaback_lager") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Hollaback Lager");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "hoppily_ever_after") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Hoppily Ever After");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "mowintime") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Mowintime");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "row_26") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Row 26");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "ruined_childhood") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Ruined Childhood");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "sleighride") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Sleighride");
    console.log("found", orderBeerName);
    removeBeerFromOrder(orderBeerName);
  } else if (classNameOfBeer == "steampunk") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Steampunk");
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

  let other = basketData.filter((beer) => beer.beerName === orderBeerName.beerName);
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
  let firstNameOfClassName = classNameOfBeer.substring(0, classNameOfBeer.indexOf("_"));
  console.log("first name", firstNameOfClassName);
  // TO DO: push another selected beer to basketData and override quantity

  if (firstNameOfClassName == "el") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "El Hefe");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "fairy") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Fairy Tale Ale");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "githop") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "GitHop");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "hollaback") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Hollaback Lager");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "hoppily") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Hoppily Ever After");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "mowintime") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Mowintime");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "row") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Row 26");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "ruined") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Ruined Childhood");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else if (firstNameOfClassName == "sleighride") {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Sleighride");
    console.log("found", orderBeerName);
    minusBeerFromOrder(orderBeerName);
  } else {
    const orderBeerName = allBeers.find((beer) => beer.beerName === "Steampunk");
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
  let other = basketData.filter((beer) => beer.beerName === orderBeerName.beerName);
  let numberOfBeer = other.length;
  let classNameBeer = orderBeerName.beerName.replaceAll(" ", "_").toLowerCase();

  if (numberOfBeer <= 0) {
    console.log("less than one in basket");
    document.querySelector(`.basket_order_cont_order.${classNameBeer}`).remove();
  } else {
    //change the number of beers in basket from new basket data
    document.querySelector(`.quantity_order.${classNameBeer}`).textContent = `${numberOfBeer}`;
    // Price of beers in basket
    document.querySelector(`.price_order.${classNameBeer}`).textContent = `${priceValue * numberOfBeer}-,`;
  }

  let amountOfBeers = basketData.length;
  let totalAmount = amountOfBeers * priceValue;

  document.querySelector(".total_amount").textContent = `${totalAmount},-`;
}
function plusBeerOrder(classNameOfBeer) {
  console.log("plus beer in basket");

  let firstNameOfClassName = classNameOfBeer.substring(0, classNameOfBeer.indexOf("_"));

  // TO DO: push another selected beer to basketData and override quantity

  if (firstNameOfClassName == "el") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "El Hefe");
    console.log("first name of calss", firstNameOfClassName);
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "fairy") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Fairy Tale Ale");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "githop") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "GitHop");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "hollaback") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Hollaback Lager");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "hoppily") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Hoppily Ever After");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "mowintime") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Mowintime");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "row") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Row 26");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "ruined") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Ruined Childhood");
    plusBeerInOrder(selectedBeer);
  } else if (firstNameOfClassName == "sleighride") {
    const selectedBeer = allBeers.find((beer) => beer.beerName === "Sleighride");
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
  let other = basketData.filter((beer) => beer.beerName === selectedBeer.beerName);
  let numberOfBeer = other.length;
  let classNameBeer = selectedBeer.beerName.replaceAll(" ", "_").toLowerCase();

  //change the number of beers in basket from new basket data
  document.querySelector(`.quantity_order.${classNameBeer}`).textContent = `${numberOfBeer}`;
  // Price of beers in basket
  document.querySelector(`.price_order.${classNameBeer}`).textContent = `${priceValue * numberOfBeer}-,`;

  let amountOfBeers = basketData.length;
  let totalAmount = amountOfBeers * priceValue;

  document.querySelector(".total_amount").textContent = `${totalAmount},-`;
}
///PAYMENT

function registerPayment() {
  document.querySelector(".card").addEventListener("click", payWithCard);
  document.querySelector(".pay").addEventListener("click", (e) => {
    e.preventDefault();

    //Check if the form is valid
    let isValid = true;
    const formEl = document.querySelectorAll("#payment input");

    formEl.forEach((el) => {
      if (!el.checkValidity()) {
        isValid = false;
      }
    });

    if (isValid) {
      console.log("valid");

      const OrderData = createObject();
      post(OrderData);

      goToReceipt();
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
  //document.querySelector(".card_payment").classList.remove("hide");
  const cardFillout = document.querySelector(".card_payment");
  //document.getElementById("sendButton").addEventListener("click", sendMail);
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
  //document.querySelector("header").classList.remove("responsive_header");
}
function sendMail(mail) {
  console.log("order", basketData);

  const mailTemplate = {
    id_number: document.getElementById("your-order").value,
    first_name: document.getElementById("name").value,
    email_to: document.getElementById("mail").value,
    //order: document.getElementsByClassName("beer_order_name").value,
    //figure out how to send the order information
    //dato?
  };

  emailjs.send("service_m4us0sl", "template_l9e40k3", mailTemplate).then(function (res) {
    console.log("success", res.status);
  });
}

function post(data) {
  const postData = JSON.stringify(data);

  fetch("https://groupfoobar.herokuapp.com/order", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },

    body: postData,
  })
    .then((res) => res.json())

    .then((data) => goToReceipt(data));

  //get();
}
