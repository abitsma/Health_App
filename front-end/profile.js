
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
    const startingData = testStartingData;
    if (startingData == null) return;

    personalInformationForm.weight.value = startingData.weight;
    personalInformationForm.height.value = startingData.height;
    personalInformationForm.age.value = startingData.age;
    personalInformationForm.gender.value = startingData.gender;
    personalInformationForm.activityLevel.value = startingData.activityLevel;
    personalInformationForm.goal.value = startingData.goal;
    
}

personalInformationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const newData = {
        weight: personalInformationForm.weight.value,
        height: personalInformationForm.height.value,
        age: personalInformationForm.age.value,
        gender: personalInformationForm.gender.value,
        activityLevel: personalInformationForm.activityLevel.value,
        goal: personalInformationForm.goal.value,
    };
    console.log(newData);
});

init();