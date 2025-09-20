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
        console.log(weatherData)

    } catch(error) {
        console.error("Failed to get weather data")
    }
}

getWeather(sampLoc)