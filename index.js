
const FOOD_NAME_INDEX = 0;
const FOOD_CAL_INDEX = 1;

let foodData = new Map([
    ["targetCalories", 1991],
    ["totalProtein", 81],
    ["totalCarbs", 172],
    ["totalFat", 43],
    ["breakfast", [
        ["Oatmeal with Berries", 380],
        ["Greek Yogurt", 150],
    ]],
    ["lunch", [
        ["Chicken & Rice Bowl", 520],
        ["Side Salad", 85],
    ]],
    ["dinner", []],
    ["snacks", [
        ["Mixed Nuts", 180],
        ["Banana", 105],
    ]],
]);



function main() {
    let totalCalCount = setupMealOverviews();
    setupTodaysSummary(totalCalCount);
    setupDailyProgress(totalCalCount);
}

/*
    Sets up all of the meal overviews

    Return:
        The amount of calories in the meals
*/
function setupMealOverviews() {
    const ELEMENT_NAME_INDEX = 0;
    const DATA_NAME_INDEX = 1;
    const mealOverviews = [
        ["breakfastOverview", "breakfast"],
        ["lunchOverview", "lunch"],
        ["dinnerOverview", "dinner"],
        ["snacksOverview", "snacks"]
    ]

    let totalCalCount = 0;

    for (let index = 0; index < mealOverviews.length; index++) {
        let mealOverviewData = mealOverviews[index];
        totalCalCount += setupMealOverview(
            document.getElementById(mealOverviewData[ELEMENT_NAME_INDEX]),
            foodData.get(mealOverviewData[DATA_NAME_INDEX])
        );
    }

    return totalCalCount;
}


/*
    Sets up the meal overview for the given meal element and data

    Parameters:
        mealElement: The meal overview element that will be updated
        mealData: The data used to update mealElement
    
    Return:
        The calories in this meal
*/
function setupMealOverview(mealElement, mealData) {
    // get food items element
    let foodItemsElement = mealElement.getElementsByClassName("foodItems")[0];
    
    // Edge Case: There are no food items logged
    if (mealData.length == 0) {
        // <p class="noFoodItem">Nothing logged</p>
        let noFoodItemElement = document.createElement("p");
        noFoodItemElement.classList.add("noFoodItem");
        noFoodItemElement.textContent = "Nothing logged";
        foodItemsElement.appendChild(noFoodItemElement);
        return 0;
    }
    
    let totalCalCount = 0;
    
    // populate the overview for each food item in meal data
    for (let index = 0; index < mealData.length; index++) {
        // <div class="foodItem"><p>Food Item</p> <p class="rightAlign">xxx</p></div>
        let foodItemData = mealData[index];
        
        // Make food item element
        let foodItemElement = document.createElement("div");
        foodItemElement.classList.add("foodItem");
        foodItemsElement.appendChild(foodItemElement);
        
        // Make the food item label element
        let foodLabelElement = document.createElement("p");
        foodLabelElement.textContent = foodItemData[FOOD_NAME_INDEX];
        foodItemElement.appendChild(foodLabelElement);
        
        // Make food calorie count element
        let foodCalCountElement = document.createElement("p");
        foodCalCountElement.classList.add("rightAlign");
        let calCount = foodItemData[FOOD_CAL_INDEX]
        foodCalCountElement.textContent = formatInt(calCount);
        foodItemElement.appendChild(foodCalCountElement);
        
        // add to totalCalCount
        totalCalCount += calCount;
    }
    
    // Update total calorie element
    let totalElement = mealElement.getElementsByClassName("total")[0];
    totalElement.textContent = formatInt(totalCalCount) + " kcal";
    
    return totalCalCount;
}


/*
    Sets up Today's Summary

    Parameter:
        totalCalCount: The total amount of calories already consumed
*/
function setupTodaysSummary(totalCalCount) {
    // get data
    let targetCalCount = foodData.get("targetCalories");
    let remainingCal = targetCalCount - totalCalCount;

    let proteinCount = foodData.get("totalProtein");
    let carbCount = foodData.get("totalCarbs");
    let fatCount = foodData.get("totalFat");

    // get todays summary element
    let todaysSummaryElement = document.getElementById("summary");

    // update calorie count
    let calorieCountElement = todaysSummaryElement.getElementsByClassName("calorieCount")[0];
    calorieCountElement.innerHTML = "<strong>" + formatInt(totalCalCount) +"</strong> / " + formatInt(targetCalCount);

    // update remaining calories
    let remainingCaloriesElement = todaysSummaryElement.getElementsByClassName("remainingCalories")[0];
    remainingCaloriesElement.textContent = formatInt(remainingCal) + " kcal remaining";


    // update macros
    function updateMacroNum(macroElement, macroNum) {
        let macroNumElement = macroElement.querySelector("p strong");
        macroNumElement.textContent = formatInt(macroNum);
    }
    updateMacroNum(document.getElementById("proteinMacro"), foodData.get("totalProtein"));
    updateMacroNum(document.getElementById("carbMacro"), foodData.get("totalCarbs"));
    updateMacroNum(document.getElementById("fatMacro"), foodData.get("totalFat"));
}

/*
    Sets up Daily Progress

    Parameter:
        totalCalCount: The total amount of calories already consumed
*/

/*
<section class="widget" id="dailyProgress">
    <h2>Daily Progress</h2>
    <p class="percentOfGoal">XX% of daily goal</p>
    <p class="rightAlign">x,xxx / x,xxx kcal</p>
    <progress id="dailyProgressBar" value="75" max="100"></progress>
    <p>0</p>
    <p class="rightAlign">x,xxx kcal</p>
</section>
*/
function setupDailyProgress(totalCalCount) {
    let dailyProgressElement = document.getElementById("dailyProgress");
    let targetCalories = foodData.get("targetCalories");

    // Update percentage of goal
    let percentOfGoalElement = dailyProgressElement.getElementsByClassName("percentOfGoal")[0];
    let percentage = totalCalCount / targetCalories * 100.0;
    percentOfGoalElement.textContent = Math.round(percentage) + "% of daily goal";
    
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

main()