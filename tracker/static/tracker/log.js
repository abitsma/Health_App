document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".mealAddButton");

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const mealType = this.dataset.meal;

            window.location.href =
                window.addFoodURL + "?mealType=" + mealType;

        });

    });

});