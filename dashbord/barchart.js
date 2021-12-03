import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

const queueArray = [];

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

const popups = {
  popQueue: false,
  popBartenders: false,
  popCalendar: false,
  popBeer: false,
  popIncome: false,
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

  //Open the popup for the queue

  document.querySelector("#burger-button").addEventListener("click", () => {
    const element = document.querySelector("#dash-nav-mobil");
    toggleHide(element);
  });

  document.querySelectorAll(".popup-queue").forEach((button) => {
    button.addEventListener("click", () => {
      popups.popQueue = true;

      setTimeout(registerClose, 1000);
    });
  });

  document.querySelector("#dash-queue").addEventListener("click", () => {
    popups.popQueue = true;

    setTimeout(registerClose, 1000);
  });

  //Open the popup for the income
  document.querySelectorAll(".popup-income").forEach((button) => {
    button.addEventListener("click", () => {
      popups.popIncome = true;

      setTimeout(registerClose, 1000);
    });
  });

  document.querySelector("#dash-income").addEventListener("click", () => {
    popups.popIncome = true;

    setTimeout(registerClose, 1000);
  });
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
    showBeer(data);

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
  if (popups.popQueue === true) {
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
  document.querySelector("#income-number").textContent =
    calculateIncome() + ",-";

  if (popups.popIncome === true) {
    console.log("is it true?", popups.popIncome);
    document.querySelector("#popup-income-number").textContent =
      calculateIncome() + ",-";
  }
}

//Function calculating the income
function calculateIncome() {
  const income = beer.newCount * 50;
  return income;
}

//Function to display the donut chart
function displayDonutChart() {
  const chartContainer = document.querySelector("#chart-container");
  //Removing the old canvas, since clear and destroy is not working
  chartContainer.innerHTML = "";

  //Creating a new canvas element to display the update
  const canvas = document.createElement("canvas");
  chartContainer.appendChild(canvas);

  const donutChart = chartContainer.querySelector("canvas");

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

  //Making the donut chart in the popup
  if (popups.popIncome === true) {
    const popChartContainer = document.querySelector("#popup-chart-container");
    //Removing the old canvas, since clear and destroy is not working
    popChartContainer.innerHTML = "";

    //Creating a new canvas element to display the update
    const popCanvas = document.createElement("canvas");
    popChartContainer.appendChild(popCanvas);

    const popDonutChart = popChartContainer.querySelector("canvas");

    const xValues = ["income", "none"];
    let yValues = [income, goal];
    const barColors = ["#efd7b3", "transparent"];

    new Chart(popDonutChart, {
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
}

//Function toggleling hide from object
function toggleHide(element) {
  if (element.classList.contains("hide")) {
    element.classList.remove("hide");
  } else {
    element.classList.add("hide");
  }
}

function registerClose() {
  document.querySelector(".close-popup").addEventListener("click", () => {
    popups.popQueue = false;
    popups.popBartenders = false;
    popups.popCalendar = false;
    popups.popBeer = false;
    popups.popIncome = false;
  });
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
}
