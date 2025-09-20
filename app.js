const apiKey = "9RUSMDKRAZRF7R5UBFEXEA8Q7";

async function getWeather(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`);
        if (!response.ok) throw new Error("Location not found");

        const data = await response.json();
        renderCurrentWeather(data);
        renderForecast(data);

    } catch (error) {
        showError(error.message);
    }
}

// نگاشت شرایط به آیکون
function getWeatherIcon(condition) {
    const map = {
        "clear": "☀️",
        "clear-day": "☀️",
        "partly-cloudy-day": "⛅",
        "cloudy": "☁️",
        "rain": "🌧️",
        "snow": "❄️",
        "fog": "🌫️",
        "thunderstorm": "⛈️"
    };
    return map[condition.toLowerCase()] || "🌡️";
}

// نمایش آب‌وهوای فعلی
function renderCurrentWeather(data) {
    const container = document.getElementById("currentWeather");
    container.innerHTML = ""; // پاک کردن قبلی

    const card = document.createElement("div");
    card.className = "weather-card";

    const title = document.createElement("h3");
    title.textContent = data.resolvedAddress;
    card.appendChild(title);

    const icon = document.createElement("p");
    icon.className = "weather-icon";
    icon.textContent = `${getWeatherIcon(data.currentConditions.icon)} ${data.currentConditions.conditions}`;
    card.appendChild(icon);

    const temp = document.createElement("p");
    temp.innerHTML = `<strong>Temperature:</strong> ${data.currentConditions.temp}°F`;
    card.appendChild(temp);

    const feels = document.createElement("p");
    feels.innerHTML = `<strong>Feels Like:</strong> ${data.currentConditions.feelslike}°F`;
    card.appendChild(feels);

    const humidity = document.createElement("p");
    humidity.innerHTML = `<strong>Humidity:</strong> ${data.currentConditions.humidity}%`;
    card.appendChild(humidity);

    const wind = document.createElement("p");
    wind.innerHTML = `<strong>Wind Speed:</strong> ${data.currentConditions.windspeed} km/h`;
    card.appendChild(wind);

    container.appendChild(card);
}

// نمایش پیش‌بینی 7 روز آینده
function renderForecast(data) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    const container = document.createElement("div");
    container.className = "forecast-container";

    data.days.slice(1, 8).forEach(day => {
        const card = document.createElement("div");
        card.className = "weather-card forecast-card";

        const date = document.createElement("h4");
        date.textContent = day.datetime;
        card.appendChild(date);

        const icon = document.createElement("p");
        icon.className = "weather-icon";
        icon.textContent = `${getWeatherIcon(day.icon)} ${day.conditions}`;
        card.appendChild(icon);

        const max = document.createElement("p");
        max.innerHTML = `<strong>Max:</strong> ${day.tempmax}°F`;
        card.appendChild(max);

        const min = document.createElement("p");
        min.innerHTML = `<strong>Min:</strong> ${day.tempmin}°F`;
        card.appendChild(min);

        container.appendChild(card);
    });

    forecastContainer.appendChild(container);
}

// نمایش خطا
function showError(message) {
    const container = document.getElementById("currentWeather");
    container.innerHTML = "";
    const p = document.createElement("p");
    p.style.color = "red";
    p.textContent = message;
    container.appendChild(p);
}

// اتصال input
document.getElementById("searchBtn").addEventListener("click", () => {
    const loc = document.getElementById("cityInput").value.trim();
    if (loc) getWeather(loc);
    else showError("Please enter a location");
});

document.getElementById("cityInput").addEventListener("keypress", e => {
    if (e.key === "Enter") document.getElementById("searchBtn").click();
});
