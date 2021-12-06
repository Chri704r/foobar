import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

const queueArray = [];

let barData;

const beer = {
  beerArray: [],
  lastCount: 0,
  newCount: 0,
};

const workstatus = {
  waiting: "Waiting",
  pourBeer: "Pouring beer",
  replaceKeg: "Replacing keg",
  releaseTap: "Releasing tap",
  reserveTap: "Reserving tap",
  startServing: "Starting to serve",
  receivePayment: "Receiving payment",
};

const beerSold = {
  Peter: {
    sold: 0,
    custServed: 0,
    income: 0,
  },
  Klaus: {
    sold: 0,
    custServed: 0,
    income: 0,
  },
  Jonas: {
    sold: 0,
    custServed: 0,
    income: 0,
  },
  Dannie: {
    sold: 0,
    custServed: 0,
    income: 0,
  },
  custumersServed: [],
};

function init() {
  getData();
  registerButtons();
}

function registerButtons() {
  document.querySelector("#burger-button").addEventListener("click", () => {
    const element = document.querySelector("#dash-nav-mobil");
    toggleHide(element);
  });

  document.querySelector("#dash-taps").addEventListener("click", () => {
    popups.popBeer = true;
    displayBeer();
    showBeer(barData);
  });

  //Open the popup for the queue
  document.querySelectorAll(".popup-queue").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#popup-queue").classList.remove("hide");
      document
        .querySelector("#dash-content-wrapper")
        .classList.add("popup-blur");
    });
  });

  document.querySelector("#dash-queue").addEventListener("click", () => {
    document.querySelector("#popup-queue").classList.remove("hide");
    document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
  });

  //Open the popup for the income
  document.querySelectorAll(".popup-income").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#popup-income").classList.remove("hide");
      document
        .querySelector("#dash-content-wrapper")
        .classList.add("popup-blur");
    });
  });

  document.querySelector("#dash-income").addEventListener("click", () => {
    document.querySelector("#popup-income").classList.remove("hide");
    document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
  });

  //Open the popup for the bartenders
  document.querySelectorAll(".popup-bartender").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#popup-bartenders").classList.remove("hide");
      document
        .querySelector("#dash-content-wrapper")
        .classList.add("popup-blur");
    });
  });

  document.querySelector("#dash-bartenders").addEventListener("click", () => {
    document.querySelector("#popup-bartenders").classList.remove("hide");
    document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
  });

  //Open the popup for the Beer
  document.querySelectorAll(".popup-beer").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#popup-beer").classList.remove("hide");
      document
        .querySelector("#dash-content-wrapper")
        .classList.add("popup-blur");
    });
  });

  document.querySelector("#dash-taps").addEventListener("click", () => {
    document.querySelector("#popup-beer").classList.remove("hide");
    document.querySelector("#dash-content-wrapper").classList.add("popup-blur");
  });

  //Button for closing/hiding the popup
  document.querySelectorAll(".close-popup").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelector("#dash-content-wrapper")
        .classList.remove("popup-blur");

      document.querySelectorAll(".pop-article").forEach((article) => {
        article.classList.add("hide");
      });
    });
  });
}

async function getData() {
  const dataUrl = "https://groupfoobar.herokuapp.com/";
  const beerUrl = "https://groupfoobar.herokuapp.com/beertypes";

  const beerData = await fetchfunction(beerUrl);
  console.log("beer", beerData);

  async function dataLoop() {
    const data = await fetchfunction(dataUrl);
    console.log("data", data);
    calculateBartenderStats(data);

    barData = data;

    createBarchart(data);
    displayBartenders(data);
    countBeer(data);
    showBeer(data);

    setTimeout(dataLoop, 5000);
  }

  dataLoop();
}

async function fetchfunction(url) {
  const response = await fetch(url);

  const data = await response.json();
  return data;
}

//Function creating the barchart
function createBarchart(data) {
  //calculating the length of the queue, setting it to 0.1 if it is 0, so the bar is still shown i the chart
  let queue = data.queue.length;
  if (queue === 0) {
    queue = 0.1;
  }

  //If there are 10 items in the array remove the first/oldest
  if (queueArray.length === 10) {
    queueArray.shift();
  }

  //Add the new item to the array
  queueArray.push(queue);

  displayBarchart();
}

function displayBarchart() {
  //For loop displaying the bars
  for (let i = 0; i < queueArray.length; i++) {
    document.querySelector(`#bar-${i + 1}`).style.height = `${
      queueArray[i] * 2
    }vh`;
  }

  //To display the chart standing up
  const bars = document.querySelectorAll(".bar.hide");
  bars.forEach((bar) => {
    bar.classList.remove("hide");
  });

  if (window.innerWidth < 1000) {
    for (let i = 0; i < queueArray.length; i++) {
      document.querySelector(`#pop-bar-${i + 1}`).style.width = `${
        queueArray[i] * 5
      }vw`;

      if (queueArray[i] >= 1) {
        document.querySelector(`#pop-bar-${i + 1} span`).textContent =
          queueArray[i];
      }
    }
    //To display the chart lying down
  } else {
    for (let i = 0; i < queueArray.length; i++) {
      document.querySelector(`#pop-bar-${i + 1}`).style.height = `${
        queueArray[i] * 5
      }vw`;

      if (queueArray[i] >= 1) {
        document.querySelector(`#pop-bar-${i + 1} span`).textContent =
          queueArray[i];
      }
    }
  }
}

//Function displaying the bartenders and what they are doing
function displayBartenders(data) {
  //Create clone of the template
  const bartenders = data.bartenders;

  document.querySelectorAll(".bart-display").forEach((display) => {
    display.innerHTML = "";

    bartenders.forEach((bartender) => {
      const clone = document
        .querySelector("#temp-bartender")
        .content.cloneNode(true);

      if (bartender.usingTap === null) {
        bartender.usingTap = "None";
      }

      //Insert bartender in clone
      clone.querySelector(".bartender-name").textContent = bartender.name;
      clone.querySelector(".status").textContent = bartender.status;
      clone.querySelector(".status-detail").textContent =
        workstatus[bartender.statusDetail];
      clone.querySelector(".using-tap").textContent =
        "Using tab: " + bartender.usingTap;

      clone
        .querySelector(".bart-article")
        .setAttribute("class", `bart-${bartender.name}`);

      //Append clone to section
      display.appendChild(clone);

      if (display === document.querySelector("#pop-bartenders")) {
        displayStatisstics(bartender);
      }
    });
  });
}

function displayStatisstics(bartender) {
  const thisBartender = bartender.name;

  const clone = document
    .querySelector("#temp-bart-stats")
    .content.cloneNode(true);

  //Insert in the clone
  clone.querySelector(".cust-number").textContent =
    beerSold[thisBartender].custServed;
  clone.querySelector(".beer-number").textContent =
    beerSold[thisBartender].sold;
  clone.querySelector(".inc-number").textContent =
    beerSold[thisBartender].income;

  document
    .querySelector(`#pop-bartenders .bart-${thisBartender}`)
    .appendChild(clone);
}

//Function counting how many beers have been sold
function countBeer(data) {
  const serving = data.serving;
  beer.lastCount = beer.newCount;

  serving.forEach((person) => {
    if (!beer.beerArray.includes(person.id)) {
      beer.beerArray.push(person.id);
      beer.newCount = beer.newCount + person.order.length;
    }
  });

  displayIncome();

  const isChange = beer.lastCount == beer.newCount;

  //Checking if last count and new count are different, we only want a reload if the value have changed
  if (!isChange) {
    displayDonutChart();
  }
}

//Function to display the income
function displayIncome() {
  document.querySelectorAll(".income-number").forEach((span) => {
    span.textContent = calculateIncome() + ",-";
  });
}

//Function calculating the income
function calculateIncome() {
  const income = beer.newCount * 50;
  return income;
}

//Function to display the donut chart
function displayDonutChart() {
  //Using the calculate income to get the income for display
  let income = calculateIncome();

  //Calculating how much is left before the dayly goal is met.
  //If the income is higher than the goal income is set to max and goal to 0 every time
  let goal = 10000;
  if (income > 10000) {
    income = 10000;
    goal = 0;
  } else {
    goal = 10000 - income;
  }

  const chartContainer = document.querySelectorAll(".chart-container");
  //Removing the old canvas, since clear and destroy is not working
  chartContainer.forEach((container) => {
    container.innerHTML = "";

    //Creating a new canvas element to display the update
    const canvas = document.createElement("canvas");

    container.appendChild(canvas);

    const donutChart = container.querySelector("canvas");

    //Making the donut chart
    const xValues = ["income", "none"];
    let yValues = [income, goal];
    const barColors = ["#efd7b3", "transparent"];

    new Chart(donutChart, {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: barColors,
            data: yValues,
          },
        ],
      },
      options: {
        title: {
          display: false,
          text: "Income",
        },
        borderColor: "transparent",
      },
    });
  });
}

//Function toggleling hide from object
function toggleHide(element) {
  if (element.classList.contains("hide")) {
    element.classList.remove("hide");
  } else {
    element.classList.add("hide");
  }
}

function showBeer(data) {
  document.querySelector("#dash-taps").innerHTML = "";

  data.taps.forEach((beer) => {
    const clone = document
      .querySelector("template.tap")
      .content.cloneNode(true);

    clone.querySelector("img").src = `assets/${beer.beer}.svg`;
    clone.querySelector("p").textContent = beer.beer;

    document.querySelector("#dash-taps").appendChild(clone);
  });

  document.querySelector("#popup-dash-taps").innerHTML = "";
  document.querySelector("#popup-storage").innerHTML = "";

  data.taps.forEach((beer) => {
    const clone = document
      .querySelector("template.popup-tap")
      .content.cloneNode(true);

    clone.querySelector("img").src = `assets/${beer.beer}.svg`;
    clone.querySelector("p").textContent = beer.beer;
    clone.querySelector(
      "p:nth-child(2)"
    ).textContent = `${beer.level}/${beer.capacity}`;

    document.querySelector("#popup-dash-taps").appendChild(clone);
  });

  data.storage.forEach((beerType) => {
    const clone = document
      .querySelector("template.storage")
      .content.cloneNode(true);

    clone.querySelector(".name").textContent = beerType.name;
    clone.querySelector(".number").textContent = beerType.amount;

    document.querySelector("#popup-storage").appendChild(clone);
  });
  // popups.popBeer = false;

  // document
  //   .querySelector("#dash-content-wrapper")
  //   .classList.remove("popup-blur");
}

//Function calculating the statistics of each bartender
function calculateBartenderStats(data) {
  const bartenders = data.bartenders;
  const custumer = data.serving;

  //Calculating for each bartender
  bartenders.forEach((bartender) => {
    const custNumber = bartender.servingCustomer;

    custumer.forEach((custumer) => {
      //Looking for the order they are serving
      if (custumer.id === custNumber) {
        //Checking if the order has already been counted
        if (!beerSold.custumersServed.includes(custumer.id)) {
          //Pushing the id to array to make sure it wont be counted twice
          beerSold.custumersServed.push(custumer.id);

          //updating the global object
          const thisBartender = bartender.name;
          beerSold[thisBartender].sold += custumer.order.length;
          beerSold[thisBartender].custServed += 1;
          beerSold[thisBartender].income = beerSold[thisBartender].sold * 50;

          console.log("beerSold", beerSold);
        }
      }
    });
  });
}
