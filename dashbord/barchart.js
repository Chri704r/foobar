import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

const queueArray = [];
const beerArray = [];

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

function init() {
  getData();
}

async function getData() {
  const dataUrl = "https://groupfoobar.herokuapp.com/";
  const beerUrl = "https://groupfoobar.herokuapp.com/beertypes";

  const beerData = await fetchfunction(beerUrl);
  console.log("beer", beerData);

  dataLoop();

  async function dataLoop() {
    const data = await fetchfunction(dataUrl);
    console.log("data", data);
    createBarchart(data);
    displayBartenders(data);
    countBeer(data);

    setTimeout(dataLoop, 5000);
  }
}

async function fetchfunction(url) {
  const response = await fetch(url);

  const data = await response.json();
  return data;
}

//Function creating the barchart
function createBarchart(data) {
  let queue = data.queue.length;
  if (queue === 0) {
    queue = 0.1;
  }

  if (queueArray.length === 10) {
    queueArray.shift();
  }

  queueArray.push(queue);

  console.log("queue", queue);

  for (let i = 0; i < queueArray.length; i++) {
    document.querySelector(`#bar-${i + 1}`).style.height = `${
      queueArray[i] * 2
    }vh`;
  }
}

//Function displaying the bartenders and what they are doing, for the main dashboard
function displayBartenders(data) {
  //Create clone of the template
  const bartenders = data.bartenders;

  document.querySelector("#dash-bartenders").innerHTML = "";

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
      .setAttribute("id", `bart-${bartender.name}`);

    //Append clone to section
    document.querySelector("#dash-bartenders").appendChild(clone);
  });
}

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

  console.log("last", beer.lastCount);
  console.log("new", beer.newCount);

  const isChange = beer.lastCount == beer.newCount;

  if (!isChange) {
    displayDonutChart();
  }
}

function displayIncome() {
  document.querySelector("#income-number").textContent =
    calculateIncome() + ",-";
}

function calculateIncome() {
  const income = beer.newCount * 50;
  return income;
}

function displayDonutChart() {
  const chartContainer = document.querySelector("#chart-container");
  chartContainer.innerHTML = "";

  const canvas = document.createElement("canvas");
  chartContainer.appendChild(canvas);

  const donutChart = chartContainer.querySelector("canvas");

  const income = calculateIncome();
  const goal = 10000 - income;

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
}
