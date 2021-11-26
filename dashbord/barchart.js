import "./style.scss";

window.addEventListener("DOMContentLoaded", init);

const queueArray = [];
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

    setTimeout(dataLoop, 5000);
  }
}

async function fetchfunction(url) {
  const response = await fetch(url);

  const data = await response.json();
  return data;
}

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
    document.querySelector(`#bar-${i + 1}`).style.height = `${queueArray[i]}vh`;
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

    //Insert bartender in clone
    clone.querySelector("#bartender-name").textContent = bartender.name;
    clone.querySelector("#status").textContent = bartender.status;
    clone.querySelector("#status-detail").textContent =
      workstatus[bartender.statusDetail];
    clone.querySelector("#using-tap").textContent = bartender.usingTap;

    //Append clone to section
    document.querySelector("#dash-bartenders").appendChild(clone);
  });
}
