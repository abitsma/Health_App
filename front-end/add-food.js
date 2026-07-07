

const manualEntryFormElement = document.getElementById("manualEntryForm");
const searchFormElement = document.getElementById("searchForm");

function init() {
    const params = new URLSearchParams(window.location.search);
    if (params.size == 0) return;

    const mealType = params.get('mealType').toLowerCase();
    manualEntryFormElement.mealType.value = mealType;
}

/*
    Saves the food to the back end
*/
function submitFood(event) {
    event.preventDefault();

    const newFoodObject = {
        name: manualEntryFormElement.name.value,
        calories: manualEntryFormElement.calories.value,
        protein: manualEntryFormElement.protein.value,
        carbs: manualEntryFormElement.carbs.value,
        fat: manualEntryFormElement.fat.value,
    }
    
    const mealType = manualEntryFormElement.mealType.value;

    console.log("Food Object: ", newFoodObject);
    console.log("Meal Type: ", mealType);

    /*
                                                    TO PEOPLE TRYING TO INTERFACE WITH FRONT END
        
        This is where you can have the javascript give the server a new meal
    */
}

manualEntryFormElement.addEventListener("submit", submitFood);
init()


searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const userInput = searchFormElement.userInput.value.toLowerCase().trim();

    const searchFoods = getFoodsMacros(userInput, "DEMO_KEY");
    console.log(searchFoods);
});


const stopQuery = true;

async function searchFood(query, apiKey) {
    if (stopQuery) {
        console.log("Prevented query request");
        return [];
    }

    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=5&api_key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.foods;
}

function extractMacros(food) {
    const wanted = {
        calories: "Energy",
        protein: "Protein",
        fat: "Total lipid (fat)",
        fiber: "Fiber, total dietary",
    };

    const macros = {
        name: food.description
    };

    for (const [key, nutrientName] of Object.entries(wanted)) {
    const match = food.foodNutrients.find(
        (n) => n.nutrientName === nutrientName
        );
        macros[key] = match ? `${match.value} ${match.unitName}` : "N/A";
    }
    return macros;
}

async function getFoodsMacros(query, apiKey) {
    const foodsUnprocessed = await searchFood(query, apiKey);
    if (!foodsUnprocessed || foodsUnprocessed.length === 0) {
        return null;
    }

    let foods = [];
        foodsUnprocessed.forEach(food => {
        foods.push(extractMacros(food))
    });

    console.log(foods);
    return foods;
}

function testFunction(input) {
    console.log(input)
}

// getFoodsMacros("Potato Soup", "DEMO_KEY");




/*

[
    {
        "name": "Soup, potato",
        "calories": "90 KCAL",
        "protein": "1.51 G",
        "fat": "4.71 G",
        "fiber": "1.2 G"
    },
    {
        "name": "Soup, potato with meat",
        "calories": "109 KCAL",
        "protein": "3.78 G",
        "fat": "6.43 G",
        "fiber": "1 G"
    },
    {
        "name": "Potato soup, instant, dry mix",
        "calories": "1440 kJ",
        "protein": "9.2 G",
        "fat": "3.1 G",
        "fiber": "7.6 G"
    },
    {
        "name": "Soup, cream of potato, canned, condensed",
        "calories": "308 kJ",
        "protein": "1.51 G",
        "fat": "1.88 G",
        "fiber": "1.3 G"
    },
    {
        "name": "Soup, chicken vegetable with potato and cheese, chunky, ready-to-serve",
        "calories": "272 kJ",
        "protein": "1.16 G",
        "fat": "4.46 G",
        "fiber": "0.3 G"
    }
]

*/