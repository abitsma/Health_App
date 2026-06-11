
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


const testFoodData = {
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


function init() {
    const foodData = getFoodData();

    setupDate();
    const totalMacros = setupMeals(foodData.meals);
    setupTotalSummary(totalMacros);
}

/*
    Returns the food data recieved from the server
    TODO Actually implement it

                                                TO PEOPLE TRYING TO INTERFACE WITH FRONT END
    
    Either make this function get data like in example-food-data.json or
    you can maybe run init from the backend and pass the data as an argument like below.

    function init(foodData) {
        ...
    }

*/
function getFoodData() {
    return testFoodData;
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
    Sets up the total summary
*/
function setupTotalSummary(totalMacros) {
    const totalCalories = totalMacros.calories;
    const targetCalories = foodData.targetCalories;

    // Set up goal summary
    const totalCaloriesElement = document.getElementById("totalCalories").querySelector("p");
    totalCaloriesElement.textContent = formatInt(totalCalories) + " kcal";

    const goalElement = document.getElementById("goal").querySelector("p");
    goalElement.textContent = formatInt(targetCalories) + " kcal";

    const remainingElement = document.getElementById("remaining").querySelector("p");
    remainingElement.textContent = formatInt(targetCalories - totalCalories) + " kcal";

    // Set up Macros
    const proteinElement = document.getElementById("protein").querySelector("p");
    proteinElement.textContent = formatInt(totalMacros.protein) + "g";

    const carbsElement = document.getElementById("carbs").querySelector("p");
    carbsElement.textContent = formatInt(totalMacros.carbs) + "g";

    const fatElement = document.getElementById("fat").querySelector("p");
    fatElement.textContent = formatInt(totalMacros.fat) + "g";

    
}

/*
    Sets up the "mealLogs" HTML element and grabs total macros

    Parameter:
        meals: An array of meal objects that will be added to the page
    
    Return:
        An object that has all of the total macros
*/
function setupMeals(meals) {
    let totalMacros = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    }

    let mealLogsHTML = "";
    
    meals.forEach((meal) => {
        // update total macros
        const mealTotals = getMealTotals(meal);
        totalMacros.calories += mealTotals.calories;
        totalMacros.protein += mealTotals.protein;
        totalMacros.carbs += mealTotals.carbs;
        totalMacros.fat += mealTotals.fat;

        // update HTML
        mealLogsHTML += getMealHTML(meal, mealTotals.calories);
    });

    const mealLogsElement = document.getElementById("mealLogs");
    mealLogsElement.innerHTML = mealLogsHTML;

    return totalMacros;
}


/*
    Gets the HTML for a "mealLog" given the "meal" and its total calories

    Parameters:
        meal: A "meal" object
        mealTotalCalories: The total calories in the meal
    
    Return:
        Returns the HTML for the meal as a string
*/
function getMealHTML(meal, mealTotalCalories) {
    return `
        <section class="mealLog">
            <div class="mealHeader">
                <h2>${meal.mealName}</h2>
                <p class="rightAlign">${formatInt(mealTotalCalories)} kcal</p>
                <button type="button">+ Add</button>
            </div>
            <table class="mealLogTable">
                ${getFoodItemsHTML(meal.foodItems)}
            </table>
        </section>
    `
}

/*
    Gets the HTML for the table in the "mealLog"

    Parameters:
        foodItems: An array of "foodItem"s that will be added to the page
    
    Return:
        The HTML that will go inside the table for "mealLog" as a string
*/
function getFoodItemsHTML(foodItems) {
    if (foodItems.length == 0) {
        return `<p class="centerAlign">No foods logged</p>`;
    }

    let foodItemsHTML = `
        <tr>
            <th>Food</th>
            <th>Cal</th>
            <th>Protein</th>
            <th>Carbs</th>
            <th>Fat</th>
        </tr>
    `;

    foodItems.forEach(foodItem => {
        foodItemsHTML += getFoodItemHTML(foodItem);
    });

    return foodItemsHTML;
}

/*
    Gets the HTML for a single "foodItem"

    Parameters:
        foodItem: The given "foodItem" object to be added to the page

    Return:
        The HTML for a single "foodItem" object as a string
*/
function getFoodItemHTML(foodItem) {
    return `
        <tr>
            <td>${foodItem.name}</td>
            <td>${foodItem.calories}</td>
            <td>${foodItem.protein}</td>
            <td>${foodItem.carbs}</td>
            <td>${foodItem.fat}</td>
        </tr>
    `;
}

/*
    Gets the total macros of a meal

    Parameters:
        meal: A "meal" object that will get the calories for
    
    Return:
        Returns an object that has the total macros of a meal
*/
function getMealTotals(meal) {
    let totalMacros = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    }

    meal.foodItems.forEach((foodItem) => {
        totalMacros.calories += foodItem.calories;
        totalMacros.protein += foodItem.protein;
        totalMacros.carbs += foodItem.carbs;
        totalMacros.fat += foodItem.fat;
    });

    return totalMacros;
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

init();