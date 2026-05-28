
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


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


function main() {
    setupDate();
    // setupMeals(foodData.meals);
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

function setupMeals(meals) {
    let totalMacros = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    }

    let mealLogsHTML = "";
    
    meals.forEach((meal) => {
        mealLogsHTML += getMealHTML(meal);
        
        // update total macros
        const mealTotals = getMealTotals(meal);
        totalMacros.calories += mealTotals.calories;
        totalMacros.protein += mealTotals.protein;
        totalMacros.carbs += mealTotals.carbs;
        totalMacros.fat += mealTotals.fat;
    });

    const mealLogsElement = document.getElementById("mealLogs");
}

function getFoodItemHTML(meal) {
    return `
        <tr>
            <td>${meal.mealName}</td>
            <td>${meal.calories}</td>
            <td>${meal.protein}</td>
            <td>${meal.carbs}</td>
            <td>${meal.fat}</td>
        </tr>
    `;
}

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

main();