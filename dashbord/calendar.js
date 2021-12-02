import "./style.scss";

window.addEventListener("DOMContentLoaded", registerButtons);

function registerButtons() {
  console.log("register buttons");
  document.querySelectorAll(".popup-calendar").forEach((button) => {
    button.addEventListener("click", displayCalendar);
  });

  document
    .querySelector("#dash-calendar")
    .addEventListener("click", displayCalendar);
}

function displayCalendar() {
  console.log("display calendar");
  document.querySelector("#popup").innerHTML = `
    <article>
        <button class="close-popup">X</button>
        <h1>Calendar</h1>
        <!-- Parent container for the calendar month -->
        <div class="calendar-month">
            <!-- The calendar header -->
            <section class="calendar-month-header">
     <!-- Month name -->
            <div id="selected-month" class="calendar-month-header-selected-month">
                July 2020
            </div>

    <!-- Pagination -->
    <div class="calendar-month-header-selectors">
      <span id="previous-month-selector"><</span>
      <span id="present-month-selector">Today</span>
      <span id="next-month-selector">></span>
    </div>
  </section>
  
  <!-- Calendar grid header -->
  <ol
    id="days-of-week"
    class="day-of-week"
  >
    <li>Mo</li>
    <li>Tu</li>
    <li>We</li>
    <li>Th</li>
    <li>Fr</li>
    <li>Sa</li>
    <li>Su</li>
  </ol>

  <!-- Calendar grid -->
  <ol
    id="calendar-days"
    class="date-grid"
  >
    <li class="calendar-day">
      <span>
        1
      </span>
      ...
      <span>
        29
      </span>
    </li>
  </ol>
</div>
    </article>`;

  document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#popup").innerHTML = "";
  });
}
