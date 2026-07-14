
const testStartingData = {
    weight: 60,
    height: 170,
    age: 20,
    gender: "male",
    activityLevel: "moderate",
    goal: "maintain"
}

const personalInformationForm = document.getElementById("personalInformationForm");

function init() {
    const personData = getPersonData();
    if (personData == null) return;

    const startingData = testStartingData;
    updateForm(startingData);
    updateEstimatedCalories();
}

/*
    Returns the person data recieved from the server
    TODO Actually implement it

                                                TO PEOPLE TRYING TO INTERFACE WITH FRONT END
    
    Either make this function get data like in testStartingData above or
    you can maybe run init from the backend and pass the data as an argument like below.

    function init(personData) {
        ...
    }

*/
function getPersonData() {
    return testStartingData;
}

/*
    Updates the form with the given data
*/
function updateForm(personData) {
    if (personData == null) return;

    personalInformationForm.weight.value = personData.weight;
    personalInformationForm.height.value = personData.height;
    personalInformationForm.age.value = personData.age;
    personalInformationForm.gender.value = personData.gender;
    personalInformationForm.activityLevel.value = personData.activityLevel;
    personalInformationForm.goal.value = personData.goal;
}

function updateEstimatedCalories() {
    const personData = getFormData();
    const estimatedCalories = formatInt(calculatedEstimatedCalories(personData));
    const estimatedCaloriesElement = document.getElementById("finalEstimation").querySelector("p");
    estimatedCaloriesElement.textContent = `${estimatedCalories} calories / day`
}

/*
    Saves the profile
    TODO Actually implement the saving instead of just packaging
*/
function saveProfile(event) {
    event.preventDefault();
    const newData = getFormData();
    console.log(newData);

    /*
                                                    TO PEOPLE TRYING TO INTERFACE WITH FRONT END
        
        This is where you can have the javascript give the server updated profile information
    */
}

/*
    Returns the data in the form
*/
function getFormData() {
    return {
        weight: personalInformationForm.weight.value,
        height: personalInformationForm.height.value,
        age: personalInformationForm.age.value,
        gender: personalInformationForm.gender.value,
        activityLevel: personalInformationForm.activityLevel.value,
        goal: personalInformationForm.goal.value,
    };
}

/*
Calculates the estimated calories per day given what was input.
TODO Actually implement this function

Return:
The estimated calories needed per day
*/
function calculatedEstimatedCalories(personData) {
	const { weight, height, age, gender, activityLevel, goal } = personData;

	let bmr;
	if (gender === "male") {
		bmr = 10 * weight + 6.25 * height - 5 * age + 5;
	} else {
		bmr = 10 * weight + 6.25 * height - 5 * age - 161;
	}

	const activityMultipliers = {
		sedentary: 1.2,
		light: 1.375,
		moderate: 1.55,
		heavy: 1.725
	};

	const multiplier = activityMultipliers[activityLevel];
	if (!multiplier) {
		throw new Error(`Invalid activityLevel: ${activityLevel}`);
	}

	let tdee = bmr * multiplier;

	if (goal === "loss") {
		tdee -= 500;
	} else if (goal === "gain") {
		tdee += 500;
	} else if (goal !== "maintain") {
		throw new Error(`Invalid goal: ${goal}`);
	}

	return Math.round(tdee);
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
personalInformationForm.addEventListener("submit", saveProfile);
personalInformationForm.addEventListener("input", updateEstimatedCalories)