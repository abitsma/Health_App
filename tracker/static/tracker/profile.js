const personalInformationForm =
    document.getElementById("personalInformationForm");

function init() {

    const personData = getPersonData();

    if (personData == null) {
        return;
    }

    updateForm(personData);
    updateEstimatedCalories(personData);
}

/*
    Returns the person data received from Django
*/
function getPersonData() {

    const personDataElement =
        document.getElementById("person-data");

    if (!personDataElement) {

        console.error(
            "Could not find person-data from Django."
        );

        return null;
    }

    return JSON.parse(personDataElement.textContent);
}

/*
    Updates the form with the given data
*/
function updateForm(personData) {

    personalInformationForm.weight.value =
        personData.weight;

    personalInformationForm.height.value =
        personData.height;

    personalInformationForm.age.value =
        personData.age;

    personalInformationForm.gender.value =
        personData.gender;

    personalInformationForm.activityLevel.value =
        personData.activityLevel;

    personalInformationForm.goal.value =
        personData.goal;
}

/*
    Updates the estimated calories display
*/
function updateEstimatedCalories(personData) {

    const estimatedCalories =
        calculatedEstimatedCalories(personData);

    const estimatedCaloriesElement =
        document.getElementById("finalEstimation")
            .querySelector("p");

    estimatedCaloriesElement.textContent =
        formatInt(estimatedCalories) +
        " calories / day";
}

/*
    Calculates estimated calories (TDEE)
*/
function calculatedEstimatedCalories(personData) {

    const weight =
        Number(personData.weight);

    const height =
        Number(personData.height);

    const age =
        Number(personData.age);

    if (
        weight <= 0 ||
        height <= 0 ||
        age <= 0
    ) {
        return 0;
    }

    let bmr;

    if (personData.gender === "male") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    }
    else {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }

    let activityMultiplier = 1.2;

    switch (personData.activityLevel) {

        case "sedentary":
            activityMultiplier = 1.2;
            break;

        case "light":
            activityMultiplier = 1.375;
            break;

        case "moderate":
            activityMultiplier = 1.55;
            break;

        case "active":
            activityMultiplier = 1.725;
            break;

        case "very_active":
            activityMultiplier = 1.9;
            break;
    }

    let calories =
        bmr * activityMultiplier;

    switch (personData.goal) {

        case "lose":
            calories -= 500;
            break;

        case "gain":
            calories += 500;
            break;

        case "maintain":
        default:
            break;
    }

    return Math.round(calories);
}

/*
    Saves the profile
    (Currently Django handles the POST)
*/
function saveProfile(event) {

    event.preventDefault();

    const newData = {

        weight:
            personalInformationForm.weight.value,

        height:
            personalInformationForm.height.value,

        age:
            personalInformationForm.age.value,

        gender:
            personalInformationForm.gender.value,

        activityLevel:
            personalInformationForm.activityLevel.value,

        goal:
            personalInformationForm.goal.value,
    };

    console.log(newData);
}

/*
    Adds commas to an integer
*/
function formatInt(intToFormat) {

    return formatIntString(
        intToFormat.toString()
    );
}

/*
    Recursive comma formatter
*/
function formatIntString(intAsString) {

    if (intAsString.length <= 3) {
        return intAsString;
    }

    let commaSpliceIndex =
        intAsString.length - 3;

    let beforeCommaSplice =
        formatIntString(
            intAsString.slice(
                0,
                commaSpliceIndex
            )
        );

    let afterCommaSplice =
        intAsString.slice(
            commaSpliceIndex,
            intAsString.length
        );

    return (
        beforeCommaSplice +
        "," +
        afterCommaSplice
    );
}

init();