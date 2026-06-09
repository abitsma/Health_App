
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const FOOD_NAME_INDEX = 0;
const FOOD_CAL_INDEX = 1;

let foodData = {
    targetCalories: 1991,
    meals: [
        {
            mealName: "Breakfast",
            foodItems: [
                {
                    name: "Oatmeal with Berries",
                    calories: 380,
                    protein: 14,
                    carbs: 65,
                    fat: 8
                },
                {
                    name: "Greek Yogurt",
                    calories: 150,
                    protein: 17,
                    carbs: 8,
                    fat: 4
                }
            ]
        },
        {
            mealName: "Lunch",
            foodItems: [
                {
                    name: "Chicken & Rice Bowl",
                    calories: 520,
                    protein: 42,
                    carbs: 52,
                    fat: 12
                },
                {
                    name: "Side Salad",
                    calories: 85,
                    protein: 2,
                    carbs: 12,
                    fat: 4
                },
            ]
        },
        {
            mealName: "Dinner",
            foodItems: []
        },
        {
            mealName: "Snacks",
            foodItems: [
                {
                    name: "Mixed Nuts",
                    calories: 180,
                    protein: 5,
                    carbs: 8,
                    fat: 15
                },
                {
                    name: "Banana",
                    calories: 105,
                    protein: 1,
                    carbs: 27,
                    fat: 0
                }
            ]
        }
    ]
};

let foodItem = {
    name: "Oatmeal with Berries",
    calories: 380,
    protein: 14,
    carbs: 65,
    fat: 8
}

function main() {
    const targetCalories = foodData.targetCalories;
    const meals = foodData.meals;

    setupDate();
    const totalMacros = setupMealOverviews(meals);
    setupTodaysSummary(totalMacros.totalCalCount, targetCalories, totalMacros.totalProteinCount, totalMacros.totalCarbCount, totalMacros.totalFatCount);
    setupDailyProgress(totalMacros.totalCalCount, targetCalories);
}

/*
    Updates the date
*/
function setupDate() {
    let currentDate = new Date();

    let dayName = dayNames[currentDate.getDay()];
    let monthName = monthNames[currentDate.getMonth()];
    let dayNum = currentDate.getDate();
    let year = currentDate.getFullYear();

    let dateElement = document.getElementById("date");
    dateElement.textContent = dayName + ", " + monthName + " " + dayNum + ", " + year;
}

/*
    Sets up all of the meal overviews

    Return:
        An object that contains the total macros for all food
*/
function setupMealOverviews(meals) {
    // initialize total macros
    let totalCalCount = 0;
    let totalProteinCount = 0;
    let totalCarbCount = 0;
    let totalFatCount = 0;

    // Get HTML for the meals
    let mealsHTML = "";
    meals.forEach((meal) => {
        // initialize total meal calorie count
        let totalMealCalCount = 0;

        // Get the HTML for the food items
        let foodItemsHTML = "";
        meal.foodItems.forEach((foodItem) => {
            foodItemsHTML += `
                <div class="foodItem">
                    <p>${foodItem.name}</p>
                    <p class="rightAlign">${formatInt(foodItem.calories)}</p>
                </div>
                `

            // Update total meal calorie count
            totalMealCalCount += foodItem.calories;

            // Update general total macros
            totalCalCount += foodItem.calories;
            totalProteinCount += foodItem.protein;
            totalCarbCount += foodItem.carbs;
            totalFatCount += foodItem.fat;
        });

        // If there were no food items
        if (foodItemsHTML == "") {
            foodItemsHTML = '<p class="noFoodItem">Nothing logged</p>';
        }

        // Add to the meals HTML
        mealsHTML += `
            <section class="mealOverview">
                <div class="mealOverviewHeader">
                    <h3>${meal.mealName}</h3>
                    <p class="rightAlign total">${formatInt(totalMealCalCount)} kcal</p>
                </div>
                <div class="foodItems">
                    ${foodItemsHTML}
                </div>
                <button type="button" class="mealAddButton">+ Add</button>
            </section>
            `;
    });

    const mealOverviewsElement = document.getElementById("mealOverviews");
    
    mealOverviewsElement.innerHTML = mealsHTML;

    return {
        totalCalCount: totalCalCount,
        totalProteinCount: totalProteinCount,
        totalCarbCount: totalCarbCount,
        totalFatCount: totalFatCount
    };
}


/*
    Sets up Today's Summary

    Parameter:
        totalCalCount: The total amount of calories already consumed
*/
function setupTodaysSummary(totalCalCount, targetCalCount, proteinCount, carbCount, fatCount) {
    // get todays summary element
    let todaysSummaryElement = document.getElementById("summary");
    
    // update calorie count
    let calorieCountElement = todaysSummaryElement.getElementsByClassName("calorieCount")[0];
    calorieCountElement.innerHTML = "<strong>" + formatInt(totalCalCount) +"</strong> / " + formatInt(targetCalCount);
    
    // update remaining calories
    let remainingCaloriesElement = todaysSummaryElement.getElementsByClassName("remainingCalories")[0];
    let remainingCal = targetCalCount - totalCalCount;
    remainingCaloriesElement.textContent = formatInt(remainingCal) + " kcal remaining";


    // update macros
    function updateMacroNum(macroElement, macroNum) {
        let macroNumElement = macroElement.querySelector("p strong");
        macroNumElement.textContent = formatInt(macroNum);
    }
    updateMacroNum(document.getElementById("proteinMacro"), proteinCount);
    updateMacroNum(document.getElementById("carbMacro"), carbCount);
    updateMacroNum(document.getElementById("fatMacro"), fatCount);
}

/*
    Sets up Daily Progress

    Parameter:
        totalCalCount: The total amount of calories already consumed
*/
function setupDailyProgress(totalCalCount, targetCalories) {
    let dailyProgressElement = document.getElementById("dailyProgress");

    // Update percentage of goal
    let percentOfGoalElement = dailyProgressElement.getElementsByClassName("percentOfGoal")[0];
    let percentage = totalCalCount / targetCalories * 100.0;
    percentOfGoalElement.textContent = Math.round(percentage) + "% of daily goal";
    
    // Update progress bar
    let dailyProgressBarElement = document.getElementById("dailyProgressBar");
    dailyProgressBarElement.style.gridTemplateColumns = percentage + "%";

    // Update fractional progress
    let fractionalProgressElement = dailyProgressElement.getElementsByClassName("fractionalProgress")[0];
    fractionalProgressElement.textContent = formatInt(totalCalCount) + "/ " + formatInt(targetCalories) +" kcal";

    // <p class="rightAlign barCalCount">x,xxx kcal</p>
    // Update progress bar calorie count
    let barCalCountElement = dailyProgressElement.getElementsByClassName("barCalCount")[0];
    barCalCountElement.textContent = formatInt(totalCalCount) + " kcal";
}


/*
    Adds comma to a given int

    Parameter:
        intToFormat: Is converted to a string with commas
    
    Return:
        Returns the formatted int
*/
function formatInt(intToFormat) {
    return formatIntString(intToFormat.toString());
}


/*
    Does the actual work of formatInt.
    This takes a string as input and gives it commas.

    Parameter:
        intAsString: A string that was an int that will be formatted
    
    Return:
        intAsString with commas
*/
function formatIntString(intAsString) {
    if (intAsString.length <= 3) {
        return intAsString;
    }

    let commaSpliceIndex = intAsString.length - 3;
    let beforeCommaSplice = formatIntString(intAsString.slice(0, commaSpliceIndex));
    let afterCommaSplice = intAsString.slice(commaSpliceIndex, intAsString.length);
    return beforeCommaSplice + "," + afterCommaSplice;
}

setupDate();