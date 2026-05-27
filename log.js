
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
}

/*
    Updates the date
*/
function setupDate() {
    console.log("ran");
    let currentDate = new Date();

    let dayName = dayNames[currentDate.getDay()];
    let monthName = monthNames[currentDate.getMonth()];
    let dayNum = currentDate.getDate();
    let year = currentDate.getFullYear();

    let dateElement = document.getElementById("date");
    dateElement.textContent = dayName + ", " + monthName + " " + dayNum + ", " + year;
}

main();