// main.js

// get elements
var sideNav = document.querySelector(".side-nav");
var navHeader = document.querySelector(".nav-header");
var icon = document.querySelector(".open-close-icon");
var rowData = document.getElementById("rowData");
var searchResults = document.getElementById("searchResults");
var loader = document.getElementById("appLoader");

// open and close side menu
function openMenu() {
    sideNav.classList.add("open");
    navHeader.classList.add("shifted");
    icon.classList.remove("fa-align-justify");
    icon.classList.add("fa-xmark");
}

function closeMenu() {
    sideNav.classList.remove("open");
    navHeader.classList.remove("shifted");
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-align-justify");
}

icon.addEventListener("click", function() {
    if (sideNav.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

// close menu when click outside
document.addEventListener("click", function(e) {
    if (!e.target.closest(".side-nav") && !e.target.closest(".open-close-icon")) {
        if (sideNav.classList.contains("open")) {
            closeMenu();
        }
    }
});

// show loader
function showLoading() {
    loader.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

// hide loader
function hideLoading() {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
}

// show page function
function showPage(pageId) {
    var pages = document.querySelectorAll(".page");
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.add("d-none");
    }
    document.getElementById(pageId).classList.remove("d-none");
    window.scrollTo(0, 0);
    closeMenu();
}

window.showPage = showPage;
window.closeSideNav = closeMenu;

// get meals from API
function getMeals() {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayMeals(data.meals);
            hideLoading();
        });
}

// display meals
function displayMeals(meals) {
    var box = "";
    for (var i = 0; i < meals.length; i++) {
        box += `
            <div class="col-md-3">
                <div class="meal position-relative overflow-hidden rounded-2" data-id="${meals[i].idMeal}">
                    <img src="${meals[i].strMealThumb}" class="w-100" alt="">
                    <div class="meal-layer d-flex align-items-center">
                        <h5 class="text-dark fw-bold mb-0">${meals[i].strMeal}</h5>
                    </div>
                </div>
            </div>
        `;
    }
    rowData.innerHTML = box;
}

// when click on meal card
document.addEventListener("click", function(e) {
    if (e.target.closest(".meal")) {
        var mealCard = e.target.closest(".meal");
        var mealId = mealCard.getAttribute("data-id");
        getMealDetails(mealId);
    }
});

// get meal details
function getMealDetails(id) {
    showLoading();
    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            hideLoading();
            var meal = data.meals[0];
            showMealDetails(meal);
        });
}

// show meal details
function showMealDetails(meal) {
    document.getElementById("detailImg").src = meal.strMealThumb;
    document.getElementById("meal-title").innerHTML = meal.strMeal;
    document.getElementById("meal-instructions").innerHTML = meal.strInstructions;
    document.getElementById("meal-area").innerHTML = meal.strArea;
    document.getElementById("meal-category").innerHTML = meal.strCategory;

    // ingredients
    var ingredients = "";
    for (var i = 1; i <= 20; i++) {
        if (meal["strIngredient" + i]) {
            ingredients += `<li class="me-2 mb-2">
                <span class="ingredient-chip">${meal["strMeasure" + i]} ${meal["strIngredient" + i]}</span>
            </li>`;
        }
    }
    document.getElementById("meal-chips").innerHTML = ingredients;

    document.getElementById("srcBtn").href = meal.strSource;
    document.getElementById("ytBtn").href = meal.strYoutube;

    showPage("mealPage");
}

// search by name
var searchInput = document.getElementById("searchByName");
var searchTimeout;
searchInput.addEventListener("input", function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
        var searchValue = searchInput.value;
        if (searchValue == "") {
            searchResults.innerHTML = "";
            return;
        }
        fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchValue)
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                displaySearchResults(data.meals);
            });
    }, 300);
});

// search by letter
var letterInput = document.getElementById("searchByLetter");
letterInput.addEventListener("input", function() {
    var letter = letterInput.value;
    if (letter == "") {
        searchResults.innerHTML = "";
        return;
    }
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=" + letter)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            displaySearchResults(data.meals);
        });
});

// display search results
function displaySearchResults(meals) {
    if (!meals) {
        searchResults.innerHTML = "<p class='text-white mt-3'>No results found.</p>";
        return;
    }
    var box = "";
    for (var i = 0; i < meals.length; i++) {
        box += `
            <div class="col-md-3">
                <div class="meal position-relative overflow-hidden rounded-2" data-id="${meals[i].idMeal}">
                    <img src="${meals[i].strMealThumb}" class="w-100 rounded-2" alt="">
                    <div class="meal-layer d-flex align-items-center">
                        <h5 class="text-dark fw-bold mb-0">${meals[i].strMeal}</h5>
                    </div>
                </div>
            </div>
        `;
    }
    searchResults.innerHTML = box;
}

// get categories
function getCategories() {
    showLoading();
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            hideLoading();
            displayCategories(data.categories);
        });
}

function displayCategories(categories) {
    var box = "";
    for (var i = 0; i < categories.length; i++) {
        box += `
            <div class="col-md-3">
                <div class="category" onclick="getCategoryMeals('${categories[i].strCategory}')">
                    <img src="${categories[i].strCategoryThumb}" alt="">
                    <div class="category-layer">
                        <h4>${categories[i].strCategory}</h4>
                        <p>${categories[i].strCategoryDescription.substring(0, 120)}...</p>
                    </div>
                </div>
            </div>
        `;
    }
    document.getElementById("categoriesContent").innerHTML = box;
    showPage("categoriesPage");
}

function getCategoryMeals(category) {
    showLoading();
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            hideLoading();
            displayMeals(data.meals);
            showPage("home");
        });
}

// get areas
function getArea() {
    showLoading();
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            hideLoading();
            displayAreas(data.meals);
        });
}

function displayAreas(areas) {
    var box = "";
    for (var i = 0; i < areas.length; i++) {
        box += `
            <div class="col-6 col-md-3 text-center">
                <div class="area-box" onclick="getAreaMeals('${areas[i].strArea}')">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h4>${areas[i].strArea}</h4>
                </div>
            </div>
        `;
    }
    document.getElementById("areaContent").innerHTML = box;
    showPage("areaPage");
}

function getAreaMeals(area) {
    showLoading();
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + area)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            hideLoading();
            displayMeals(data.meals);
            showPage("home");
        });
}

// get ingredients
function getIngredients() {
    showLoading();
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            var ingredients = data.meals.slice(0, 28);
            displayIngredients(ingredients);
        });
}

function displayIngredients(ingredients) {
    var box = `<div class="row g-4 ingredients-grid">`;
    for (var i = 0; i < ingredients.length; i++) {
        box += `
            <div class="col-6 col-md-3">
                <div class="ingredient-card" onclick="getIngredientMeals('${ingredients[i].strIngredient}')">
                    <i class="fa-solid fa-drumstick-bite"></i>
                    <h3>${ingredients[i].strIngredient}</h3>
                    <p class="ing-desc">${ingredients[i].strDescription ? ingredients[i].strDescription.substring(0, 150) + "..." : ""}</p>
                </div>
            </div>
        `;
    }
    box += `</div>`;
    document.getElementById("ingredientsContent").innerHTML = box;
    hideLoading();
    showPage("ingredientsPage");
}

function getIngredientMeals(ingredient) {
    showLoading();
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredient)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            hideLoading();
            displayMeals(data.meals);
            showPage("home");
        });
}

// contact form
function setupContactForm() {
    var contactForm = `
        <form id="contactForm" class="row g-3">
            <div class="col-md-6"><input type="text" id="name" class="form-control" placeholder="Name" required></div>
            <div class="col-md-6"><input type="email" id="email" class="form-control" placeholder="Email" required></div>
            <div class="col-md-6"><input type="text" id="phone" class="form-control" placeholder="Phone" required></div>
            <div class="col-md-3"><input type="number" id="age" class="form-control" placeholder="Age" required></div>
            <div class="col-md-3"><input type="password" id="password" class="form-control" placeholder="Password" required></div>
            <div class="col-12"><input type="password" id="rePassword" class="form-control" placeholder="Confirm Password" required></div>
            <div class="col-12"><button class="btn btn-primary" type="submit">Send</button></div>
            <div class="col-12"><div id="contactMsg"></div></div>
        </form>
    `;
    document.getElementById("contactContent").innerHTML = contactForm;

    document.getElementById("contactForm").addEventListener("submit", function(e) {
        e.preventDefault();
        document.getElementById("contactMsg").innerHTML = '<div class="alert alert-success">Message sent successfully!</div>';
        document.getElementById("contactForm").reset();
    });
}

// start app
window.addEventListener("DOMContentLoaded", function() {
    showLoading();
    getMeals();
    setupContactForm();
});


// validation

/* ==========================
   Contact form validation
   Plain JS (ready for main.js)
   ========================== */

// Regex rules (kept from your original)
const nameRegex = /^[a-zA-Z]+$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;

/* ---------------------------
   small DOM helpers
   --------------------------- */
function $qs(sel, ctx = document) { return ctx.querySelector(sel); }
function $qsa(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

/* ---------------------------
   Validation functions
   --------------------------- */

function showAlert(alertEl, msg) {
  if (!alertEl) return;
  alertEl.textContent = msg;
  alertEl.classList.remove('d-none');
}

function hideAlert(alertEl) {
  if (!alertEl) return;
  alertEl.textContent = '';
  alertEl.classList.add('d-none');
}

// Name validation
function validateName(inputEl, alertEl) {
  const name = (inputEl.value || '').trim();
  if (name === '') {
    showAlert(alertEl, 'Username is required.');
    return false;
  } else if (nameRegex.test(name)) {
    hideAlert(alertEl);
    return true;
  } else {
    showAlert(alertEl, 'Special characters and numbers not allowed.');
    return false;
  }
}

// Email validation
function validateEmail(inputEl, alertEl) {
  const email = (inputEl.value || '').trim();
  if (email === '') {
    showAlert(alertEl, 'Email is required.');
    return false;
  } else if (emailRegex.test(email)) {
    hideAlert(alertEl);
    return true;
  } else {
    showAlert(alertEl, 'Email not valid *example@yyy.zzz');
    return false;
  }
}

// Phone validation
function validatePhone(inputEl, alertEl) {
  const phone = (inputEl.value || '').trim();
  if (phone === '') {
    showAlert(alertEl, 'Phone is required.');
    return false;
  } else if (phoneRegex.test(phone)) {
    hideAlert(alertEl);
    return true;
  } else {
    showAlert(alertEl, 'Enter valid Phone Number');
    return false;
  }
}

// Age validation
function validateAge(inputEl, alertEl) {
  const age = (inputEl.value || '').trim();
  if (age === '') {
    showAlert(alertEl, 'Your age is required.');
    return false;
  } else if (ageRegex.test(age)) {
    hideAlert(alertEl);
    return true;
  } else {
    showAlert(alertEl, 'Enter valid age.');
    return false;
  }
}

// Password validation
function validatePassword(inputEl, alertEl) {
  const password = (inputEl.value || '').trim();
  if (password === '') {
    showAlert(alertEl, 'Password is required.');
    return false;
  } else if (passwordRegex.test(password)) {
    hideAlert(alertEl);
    return true;
  } else {
    showAlert(alertEl, 'Enter valid password *Minimum eight characters, at least one letter and one number:*');
    return false;
  }
}

// Repassword validation
function validateRepassword(inputEl, passwordValue, alertEl) {
  const repassword = (inputEl.value || '').trim();
  if (repassword === '') {
    showAlert(alertEl, 'Repassword is required.');
    return false;
  } else if (repassword !== passwordValue) {
    showAlert(alertEl, 'Enter valid repassword');
    return false;
  } else {
    hideAlert(alertEl);
    return true;
  }
}

/* ---------------------------
   clear inputs & alerts
   --------------------------- */
function clearInputs() {
  const container = $qs('#contactUs');
  if (!container) return;
  $qsa('input', container).forEach(inp => inp.value = '');
  $qsa('.alert', container).forEach(a => {
    a.classList.add('d-none');
    a.textContent = '';
  });
}

/* ---------------------------
   submit handler & state
   --------------------------- */
let submitHandlerAttached = false;

function submitContact() {
  // Reset inputs and show message (like student code did)
  clearInputs();
  alert('Your message has been successfully submitted. We will get back to you shortly.');
}

/* validateForm -> enable/disable submit btn and attach click once */
function validateForm(nameValid, emailValid, phoneValid, ageValid, passwordValid, repasswordValid) {
  const submitBtn = $qs('#submitBtn');
  if (!submitBtn) return;

  if (nameValid && emailValid && phoneValid && ageValid && passwordValid && repasswordValid) {
    submitBtn.disabled = false;
    if (!submitHandlerAttached) {
      submitHandlerAttached = true;
      submitBtn.addEventListener('click', function onClick(e) {
        // prevent default form submission if inside a form
        e.preventDefault();
        submitContact();
      });
    }
  } else {
    submitBtn.disabled = true;
  }
}

/* ---------------------------
   main attach function
   call handleInputsValidation() once on load
   --------------------------- */
function handleInputsValidation() {
  const container = $qs('#contactUs');
  if (!container) return;

  // Clear on init (mimics student code)
  clearInputs();

  // grab elements
  const nameInput = $qs('#contactUs #nameInput');
  const nameAlert = $qs('#contactUs #nameAlert');

  const emailInput = $qs('#contactUs #emailInput');
  const emailAlert = $qs('#contactUs #emailAlert');

  const phoneInput = $qs('#contactUs #phoneInput');
  const phoneAlert = $qs('#contactUs #phoneAlert');

  const ageInput = $qs('#contactUs #ageInput');
  const ageAlert = $qs('#contactUs #ageAlert');

  const passwordInput = $qs('#contactUs #passwordInput');
  const passwordAlert = $qs('#contactUs #passwordAlert');

  const repasswordInput = $qs('#contactUs #repasswordInput');
  const repasswordAlert = $qs('#contactUs #repasswordAlert');

  // initial validity flags
  let nameValid = false;
  let emailValid = false;
  let phoneValid = false;
  let ageValid = false;
  let passwordValid = false;
  let repasswordValid = false;

  // attach input listeners (use 'input' for live validation)
  if (nameInput) {
    nameInput.addEventListener('input', function () {
      nameValid = validateName(this, nameAlert);
      validateForm(nameValid, emailValid, phoneValid, ageValid, passwordValid, repasswordValid);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', function () {
      emailValid = validateEmail(this, emailAlert);
      validateForm(nameValid, emailValid, phoneValid, ageValid, passwordValid, repasswordValid);
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      phoneValid = validatePhone(this, phoneAlert);
      validateForm(nameValid, emailValid, phoneValid, ageValid, passwordValid, repasswordValid);
    });
  }

  if (ageInput) {
    ageInput.addEventListener('input', function () {
      ageValid = validateAge(this, ageAlert);
      validateForm(nameValid, emailValid, phoneValid, ageValid, passwordValid, repasswordValid);
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      passwordValid = validatePassword(this, passwordAlert);
      // re-validate repassword since password changed
      const passVal = (passwordInput.value || '').trim();
      if (repasswordInput) {
        repasswordValid = validateRepassword(repasswordInput, passVal, repasswordAlert);
      }
      validateForm(nameValid, emailValid, phoneValid, ageValid, passwordValid, repasswordValid);
    });
  }

  if (repasswordInput) {
    repasswordInput.addEventListener('input', function () {
      const passVal = (passwordInput && passwordInput.value ? passwordInput.value.trim() : '');
      repasswordValid = validateRepassword(this, passVal, repasswordAlert);
      validateForm(nameValid, emailValid, phoneValid, ageValid, passwordValid, repasswordValid);
    });
  }
}

/* Expose the function name globally (so you can call it from your init) */
window.handleInputsValidation = handleInputsValidation;

/* Optionally automatically initialize when DOM is ready if #contactUs exists */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('contactUs')) {
    handleInputsValidation();
  }
});
