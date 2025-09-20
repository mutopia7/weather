const sampLoc = "tehran"

async function getWeather(location) {
    const apiKey = "9RUSMDKRAZRF7R5UBFEXEA8Q7";
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            showError();
        }

        const weatherData = await response.json();
        displayWeather(weatherData)

    } catch(error) {
        console.error("Failed to get weather data")
    }
}

// نمایش اطلاعات اولیه (فعلا ساده)
function displayWeather(data) {
    const weatherDiv = document.getElementById("weatherResult");
    const current = data.currentConditions;

    weatherDiv.innerHTML = `
        <h3>${data.resolvedAddress}</h3>
        <p>Temperature: ${current.temp}°F</p>
        <p>Feels Like: ${current.feelslike}°F</p>
        <p>Conditions: ${current.conditions}</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.windspeed} km/h</p>
    `;
}

// نمایش خطا
function showError(message) {
    document.getElementById("weatherResult").innerHTML = `<p style="color:red">${message}</p>`;
}

// اتصال input و دکمه
document.getElementById("searchBtn").addEventListener("click", () => {
    const location = document.getElementById("cityInput").value;
    if (location.trim() !== "") {
        getWeather(location);
    } else {
        showError("Please enter a location.");
    }
});


// اجازه دادن به Enter برای جستجو
document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});

getWeather(sampLoc)