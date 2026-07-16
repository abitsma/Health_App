const manualEntryFormElement = document.getElementById("manualEntryForm");

function init() {

    const params = new URLSearchParams(window.location.search);

    if (params.has("mealType")) {

        const mealType = params.get("mealType").toLowerCase();

        const radio = document.querySelector(
            `input[name="meal_type"][value="${mealType}"]`
        );

        if (radio) {
            radio.checked = true;
        }
    }

    setupUseButtons();
}

function setupUseButtons() {

    const buttons = document.querySelectorAll(".useFoodButton");

    buttons.forEach(function(button) {

        button.addEventListener("click", function() {

            document.getElementById("food_name").value =
                this.dataset.name;

            document.getElementById("calories").value =
                this.dataset.calories;

            document.getElementById("protein").value =
                this.dataset.protein;

            document.getElementById("carbs").value =
                this.dataset.carbs;

            document.getElementById("fat").value =
                this.dataset.fat;

            manualEntryFormElement.scrollIntoView({
                behavior: "smooth"
            });

        });

    });

}

init();