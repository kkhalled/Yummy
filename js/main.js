// navside
const sideIcon = document.querySelector(".open-close-icon");
const sideNav = document.querySelector(".side-nav");
const navHeader = document.querySelector(".nav-header");

// display
const rowData = document.getElementById("rowData");

sideIcon.addEventListener("click", function () {
  sideNav.classList.toggle("open");
  navHeader.classList.toggle("shifted");

  // Toggle icon between menu and close
  if (sideIcon.classList.contains("fa-align-justify")) {
    sideIcon.classList.remove("fa-align-justify");
    sideIcon.classList.add("fa-xmark"); // close icon
  } else {
    sideIcon.classList.remove("fa-xmark");
    sideIcon.classList.add("fa-align-justify"); // menu icon
  }
});

async function getMeals() {
  let res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  let data = await res.json();

  displayMeals(data.meals);
}

function displayMeals(meals) {
  let box = "";

  meals.forEach(meal => {
    box += `
      <div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2">
          <img src="${meal.strMealThumb}" class="w-100">
          <div class="meal-layer d-flex  align-items-center">
            <h5 class="text-dark fw-bold">${meal.strMeal}</h5>
          </div>
        </div>
      </div>
    `;
  });

  rowData.innerHTML = box;
}

getMeals();

// apis
/*
serach by name 
www.themealdb.com/api/json/v1/1/search.php?s=


*/


function showPage(pageId) {
  // hide all pages
  document.querySelectorAll(".page").forEach(page => page.classList.add("d-none"));

  // show the selected page
  document.getElementById(pageId).classList.remove("d-none");
}
