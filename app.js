const apiKey = "9RUSMDKRAZRF7R5UBFEXEA8Q7";

async function getWeather(location) {
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            showError("Location not found!");
            return;
        }

        const weatherData = await response.json();
        displayWeather(weatherData);

    } catch (error) {
        showError("Failed to fetch weather data.");
    }
}

// نگاشت شرایط به آیکون‌های Emoji یا آیکون‌های کوچک
function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case "clear":
        case "clear-day":
            return "☀️";
        case "partly-cloudy-day":
        case "cloudy":
            return "⛅";
        case "rain":
            return "🌧️";
        case "snow":
            return "❄️";
        case "fog":
            return "🌫️";
        case "thunderstorm":
            return "⛈️";
        default:
            return "🌡️";
    }
}

function displayWeather(data) {
    const weatherDiv = document.getElementById("weatherResult");
    const current = data.currentConditions;

    weatherDiv.innerHTML = `
        <div class="weather-card">
            <h3>${data.resolvedAddress}</h3>
            <p class="weather-icon">${getWeatherIcon(current.icon)} ${current.conditions}</p>
            <p><strong>Temperature:</strong> ${current.temp}°F</p>
            <p><strong>Feels Like:</strong> ${current.feelslike}°F</p>
            <p><strong>Humidity:</strong> ${current.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${current.windspeed} km/h</p>
        </div>
    `;
}


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

document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});
