const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

let testFoodData = {
  targetCalories: 1991,
  meals: [
    {
      mealName: "Breakfast",
      mealType: "breakfast",
      foodItems: [
        { name: "Oatmeal with Berries", calories: 380, protein: 14, carbs: 65, fat: 8 },
        { name: "Greek Yogurt", calories: 150, protein: 17, carbs: 8, fat: 4 }
      ]
    },
    {
      mealName: "Lunch",
      mealType: "lunch",
      foodItems: [
        { name: "Chicken & Rice Bowl", calories: 520, protein: 42, carbs: 52, fat: 12 },
        { name: "Side Salad", calories: 85, protein: 2, carbs: 12, fat: 4 }
      ]
    },
    {
      mealName: "Dinner",
      mealType: "dinner",
      foodItems: []
    },
    {
      mealName: "Snacks",
      mealType: "snack",
      foodItems: [
        { name: "Mixed Nuts", calories: 180, protein: 5, carbs: 8, fat: 15 },
        { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 }
      ]
    }
  ]
};

function init() {
  const foodData = getFoodData();
  const targetCalories = foodData.targetCalories;
  const meals = foodData.meals;

  setupDate();
  const totalMacros = setupMealOverviews(meals);

  setupTodaysSummary(
    totalMacros.totalCalCount,
    targetCalories,
    totalMacros.totalProteinCount,
    totalMacros.totalCarbCount,
    totalMacros.totalFatCount
  );

  setupDailyProgress(totalMacros.totalCalCount, targetCalories);
  setupButtons();
}

/* Gets food data from Django */
function getFoodData() {
  const foodDataElement = document.getElementById("food-data");
  if (!foodDataElement) {
    console.log("Using test food data.");
    return testFoodData;
  }
  return JSON.parse(foodDataElement.textContent);
}

/* Setup date display */
function setupDate() {
  let currentDate = new Date();
  let dayName = dayNames[currentDate.getDay()];
  let monthName = monthNames[currentDate.getMonth()];
  let dayNum = currentDate.getDate();
  let year = currentDate.getFullYear();

  document.getElementById("date").textContent = dayName + ", " + monthName + " " + dayNum + ", " + year;
}

/* Creates meal cards */
function setupMealOverviews(meals) {
  let totalCalCount = 0;
  let totalProteinCount = 0;
  let totalCarbCount = 0;
  let totalFatCount = 0;
  let mealsHTML = "";

  meals.forEach((meal) => {
    let totalMealCalCount = 0;
    let foodItemsHTML = "";

    meal.foodItems.forEach((foodItem) => {
      foodItemsHTML += `
        <div class="foodItem">
          <p>${foodItem.name}</p>
          <p class="rightAlign"> ${formatInt(foodItem.calories)} </p>
        </div>
      `;
      totalMealCalCount += foodItem.calories;
      totalCalCount += foodItem.calories;
      totalProteinCount += foodItem.protein;
      totalCarbCount += foodItem.carbs;
      totalFatCount += foodItem.fat;
    });

    if (foodItemsHTML === "") {
      foodItemsHTML = '<p class="noFoodItem">Nothing logged</p>';
    }

    mealsHTML += `
      <section class="mealOverview">
        <div class="mealOverviewHeader">
          <h3>${meal.mealName}</h3>
          <p class="rightAlign total"> ${formatInt(totalMealCalCount)} kcal </p>
        </div>
        <div class="foodItems">
          ${foodItemsHTML}
        </div>
        <button type="button" class="mealAddButton" data-meal="${meal.mealType}"> + Add </button>
      </section>
    `;
  });

  document.getElementById("mealOverviews").innerHTML = mealsHTML;

  return {
    totalCalCount: totalCalCount,
    totalProteinCount: totalProteinCount,
    totalCarbCount: totalCarbCount,
    totalFatCount: totalFatCount
  };
}

/* Update summary card */
function setupTodaysSummary(totalCalCount, targetCalCount, proteinCount, carbCount, fatCount) {
  let summary = document.getElementById("summary");
  
  summary.querySelector(".calorieCount").innerHTML = "<strong>" + formatInt(totalCalCount) + "</strong> / " + formatInt(targetCalCount);
  summary.querySelector(".remainingCalories").textContent = formatInt(targetCalCount - totalCalCount) + " kcal remaining";
  
  document.querySelector("#proteinMacro strong").textContent = formatInt(proteinCount);
  document.querySelector("#carbMacro strong").textContent = formatInt(carbCount);
  document.querySelector("#fatMacro strong").textContent = formatInt(fatCount);
}

/* Update progress bar */
function setupDailyProgress(totalCalCount, targetCalories) {
  let progress = document.getElementById("dailyProgress");
  let percentage = (totalCalCount / targetCalories) * 100;

  progress.querySelector(".percentOfGoal").textContent = Math.round(percentage) + "% of daily goal";
  document.getElementById("dailyProgressBar").style.gridTemplateColumns = percentage + "%";
  
  progress.querySelector(".fractionalProgress").textContent = formatInt(totalCalCount) + "/ " + formatInt(targetCalories) + " kcal";
  progress.querySelector(".barCalCount").textContent = formatInt(totalCalCount) + " kcal";
}

/* Button setup */
function setupButtons() {
  const addFoodButton = document.getElementById("addFoodButton");
  const viewLogButton = document.getElementById("viewLogButton");

  // 1. Main Quick Action: + Add Food Button
  if (addFoodButton) {
    addFoodButton.onclick = function () {
      const url = this.getAttribute("data-url");
      if (url) {
        window.location.href = url;
      } else {
        console.error("data-url attribute missing on #addFoodButton");
      }
    };
  } else {
    console.error("Could not find #addFoodButton in the DOM.");
  }

  // 2. Main Quick Action: View Log Button
  if (viewLogButton) {
    viewLogButton.onclick = function () {
      const url = this.getAttribute("data-url");
      if (url) window.location.href = url;
    };
  }

  // 3. Dynamic Meal Specific "+ Add" buttons (Handles items generated by setupMealOverviews)
  const mealOverviewsContainer = document.getElementById("mealOverviews");
  if (mealOverviewsContainer) {
    mealOverviewsContainer.onclick = function (event) {
      // Check if the clicked item (or its parent) is a meal add button
      const button = event.target.closest(".mealAddButton");
      if (button) {
        const mealType = button.getAttribute("data-meal");
        console.log("Sending to add food for meal:", mealType);
        
        if (window.addFoodURL) {
          window.location.href = window.addFoodURL + "?mealType=" + mealType;
        } else {
          console.error("window.addFoodURL is missing from the HTML <head> context.");
        }
      }
    };
  }
}


/* Number formatting */
function formatInt(number) {
  return formatIntString(number.toString());
}

function formatIntString(string) {
  if (string.length <= 3) {
    return string;
  }
  let index = string.length - 3;
  return (
    formatIntString(string.slice(0, index)) + "," + string.slice(index)
  );
}

// Safely initializes the script only after the HTML is fully loaded and structured
document.addEventListener("DOMContentLoaded", function() {
  init();
});
