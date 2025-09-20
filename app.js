// API key for VisualCrossing
const apiKey = "9RUSMDKRAZRF7R5UBFEXEA8Q7";
let isMetric = true; // Default unit is °C
let currentData = null;

// Initialize the app with a default city
document.addEventListener('DOMContentLoaded', () => {
  getWeather("Tehran");
});

// Format city name with proper capitalization
function formatCityName(name) {
  if (!name) return '';
  
  // Split by comma to separate city from country/state
  const parts = name.split(',');
  
  // Format city name (first part)
  const city = parts[0].trim().toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Add country/state if available
  if (parts.length > 1) {
    const country = parts.slice(1).join(', ').trim();
    return `${city}, ${country}`;
  }
  
  return city;
}

// Get weather data from API
async function getWeather(location) {
  try {
    showLoading();
    const unitParam = isMetric ? "metric" : "us";
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitParam}&key=${apiKey}&contentType=json`);
    
    if (!response.ok) throw new Error("Location not found");

    const data = await response.json();
    currentData = data;
    renderCurrentWeather(data);
    renderForecast(data);
    renderWeatherDetails(data);
    
    // Show all sections
    document.getElementById('currentWeather').classList.remove('hidden');
    document.getElementById('forecast').classList.remove('hidden');
    document.getElementById('weatherDetails').classList.remove('hidden');
    hideLoading();

  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}

// Get weather icon based on condition
function getWeatherIcon(condition) {
  const iconMap = {
    "clear-day": "fas fa-sun",
    "clear-night": "fas fa-moon",
    "partly-cloudy-day": "fas fa-cloud-sun",
    "partly-cloudy-night": "fas fa-cloud-moon",
    "cloudy": "fas fa-cloud",
    "rain": "fas fa-cloud-rain",
    "snow": "fas fa-snowflake",
    "wind": "fas fa-wind",
    "fog": "fas fa-smog",
    "thunderstorm": "fas fa-bolt"
  };
  
  return iconMap[condition] || "fas fa-cloud";
}

// Convert temperature based on current unit
function convertTemp(temp) {
  if (isMetric) {
    return Math.round(temp);
  } else {
    // Convert Celsius to Fahrenheit
    return Math.round((temp * 9/5) + 32);
  }
}

// Convert speed based on current unit
function convertSpeed(speed) {
  if (isMetric) {
    return Math.round(speed) + " km/h";
  } else {
    // Convert km/h to mph
    return Math.round(speed * 0.621371) + " mph";
  }
}

// Render current weather
function renderCurrentWeather(data) {
  const container = document.getElementById("currentWeather");
  container.innerHTML = "";

  const card = document.createElement("div");
  card.className = "weather-card";

  const title = document.createElement("h2");
  title.textContent = formatCityName(data.resolvedAddress);
  card.appendChild(title);

  const datetime = document.createElement("p");
  datetime.className = "datetime";
  datetime.textContent = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  card.appendChild(datetime);

  const icon = document.createElement("i");
  icon.className = `weather-icon ${getWeatherIcon(data.currentConditions.icon)}`;
  card.appendChild(icon);

  const temp = document.createElement("div");
  temp.className = "temperature";
  temp.innerHTML = `${convertTemp(data.currentConditions.temp)}°${isMetric ? "C" : "F"}`;
  card.appendChild(temp);

  const conditions = document.createElement("div");
  conditions.className = "conditions";
  conditions.textContent = data.currentConditions.conditions;
  card.appendChild(conditions);

  const details = document.createElement("div");
  details.className = "weather-details";

  const detailsList = [
    { label: "Feels Like", value: `${convertTemp(data.currentConditions.feelslike)}°`, icon: "fas fa-temperature-high" },
    { label: "Humidity", value: `${data.currentConditions.humidity}%`, icon: "fas fa-tint" },
    { label: "Wind Speed", value: convertSpeed(data.currentConditions.windspeed), icon: "fas fa-wind" },
    { label: "Pressure", value: `${data.currentConditions.pressure} hPa`, icon: "fas fa-compress-alt" },
    { label: "UV Index", value: data.currentConditions.uvindex, icon: "fas fa-sun" },
    { label: "Visibility", value: `${data.currentConditions.visibility} ${isMetric ? "km" : "mi"}`, icon: "fas fa-eye" }
  ];

  detailsList.forEach(item => {
    const detailItem = document.createElement("div");
    detailItem.className = "detail-item";
    
    const icon = document.createElement("i");
    icon.className = item.icon;
    
    const label = document.createElement("span");
    label.textContent = item.label;
    
    const value = document.createElement("span");
    value.textContent = item.value;
    
    detailItem.appendChild(icon);
    detailItem.appendChild(label);
    detailItem.appendChild(value);
    details.appendChild(detailItem);
  });

  card.appendChild(details);
  container.appendChild(card);
}

// Render 5-day forecast
function renderForecast(data) {
  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = "";

  // Show 5-day forecast (skip today)
  data.days.slice(1, 6).forEach(day => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    const date = document.createElement("div");
    date.className = "forecast-date";
    date.textContent = new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' });
    card.appendChild(date);

    const icon = document.createElement("i");
    icon.className = `forecast-icon ${getWeatherIcon(day.icon)}`;
    card.appendChild(icon);

    const temp = document.createElement("div");
    temp.className = "forecast-temp";
    temp.innerHTML = `${convertTemp(day.temp)}°${isMetric ? "C" : "F"}`;
    card.appendChild(temp);

    const desc = document.createElement("div");
    desc.className = "forecast-desc";
    desc.textContent = day.conditions;
    card.appendChild(desc);

    const minmax = document.createElement("div");
    minmax.className = "forecast-minmax";
    
    const max = document.createElement("span");
    max.innerHTML = `H: ${convertTemp(day.tempmax)}°`;
    
    const min = document.createElement("span");
    min.innerHTML = `L: ${convertTemp(day.tempmin)}°`;
    
    minmax.appendChild(max);
    minmax.appendChild(min);
    card.appendChild(minmax);

    forecastContainer.appendChild(card);
  });
}

// Render additional weather details
function renderWeatherDetails(data) {
  const detailsGrid = document.querySelector(".details-grid");
  detailsGrid.innerHTML = "";

  const detailsList = [
    { title: "Sunrise", value: data.currentConditions.sunrise, icon: "fas fa-sun" },
    { title: "Sunset", value: data.currentConditions.sunset, icon: "fas fa-moon" },
    { title: "Chance of Rain", value: `${data.days[0].precipprob}%`, icon: "fas fa-cloud-rain" },
    { title: "Cloud Cover", value: `${data.currentConditions.cloudcover}%`, icon: "fas fa-cloud" }
  ];

  detailsList.forEach(item => {
    const card = document.createElement("div");
    card.className = "detail-card";
    
    const icon = document.createElement("i");
    icon.className = item.icon;
    
    const title = document.createElement("h3");
    title.textContent = item.title;
    
    const value = document.createElement("p");
    value.textContent = item.value;
    
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(value);
    detailsGrid.appendChild(card);
  });
}

// Show loading indicator
function showLoading() {
  document.getElementById('loadingIndicator').classList.remove('hidden');
}

// Hide loading indicator
function hideLoading() {
  document.getElementById('loadingIndicator').classList.add('hidden');
}

// Show error message
function showError(message) {
  const container = document.getElementById("currentWeather");
  container.innerHTML = "";
  
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  container.appendChild(errorDiv);
  container.classList.remove('hidden');
  
  // Hide other sections
  document.getElementById('forecast').classList.add('hidden');
  document.getElementById('weatherDetails').classList.add('hidden');
}

// Get weather by geolocation
function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser");
    return;
  }
  
  showLoading();
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(`${lat},${lon}`);
    },
    error => {
      hideLoading();
      showError("Unable to retrieve your location");
    }
  );
}

// Event Listeners
document.getElementById("searchBtn").addEventListener("click", () => {
  const loc = document.getElementById("cityInput").value.trim();
  if (loc) getWeather(loc);
  else showError("Please enter a location");
});

document.getElementById("locationBtn").addEventListener("click", getWeatherByLocation);

document.getElementById("cityInput").addEventListener("keypress", e => {
  if (e.key === "Enter") document.getElementById("searchBtn").click();
});

// Toggle unit
document.getElementById("unitSwitch").addEventListener("change", () => {
  isMetric = !isMetric;
  document.getElementById("unitLabel").textContent = isMetric ? "°C" : "°F";
  
  if (currentData) {
    renderCurrentWeather(currentData);
    renderForecast(currentData);
    renderWeatherDetails(currentData);
  }
});