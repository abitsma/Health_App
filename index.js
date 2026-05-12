
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
])



function main() {
    const ELEMENT_NAME_INDEX = 0;
    const DATA_NAME_INDEX = 1;
    const mealOverviews = [
        ["breakfastOverview", "breakfast"],
        ["lunchOverview", "lunch"],
        ["dinnerOverview", "dinner"],
        ["snacksOverview", "snacks"]
    ]
    for (let index = 0; index < mealOverviews.length; index++) {
        let mealOverviewData = mealOverviews[index];
        setupMealOverview(
            document.getElementById(mealOverviewData[ELEMENT_NAME_INDEX]),
            foodData.get(mealOverviewData[DATA_NAME_INDEX])
        );
    }
}

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
        return
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
    
}

function formatInt(intToFormat) {
    return formatIntString(intToFormat.toString());
}

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