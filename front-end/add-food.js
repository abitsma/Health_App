

const manualEntryFormElement = document.getElementById("manualEntryForm");

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