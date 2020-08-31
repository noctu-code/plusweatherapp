//gets date and time
function formatDate(timestamp) {
  let currentDate = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = currentDate.getDay();
  let day = days[currentDay];
  return `${day} ${formatHours(timestamp)}`;
}

//if number is below 10, adds a 0 in front of the number
function formatHours(timestamp) {
  let currentDate = new Date(timestamp);
  let currentHour = currentDate.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = currentDate.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  return `${currentHour}:${currentMinutes}`;
}

//creates cards with content for weather forecast
function showForecast(response) {
  let forecastElement = document.querySelector("#temperatureforecast1");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2.5">
    <div class="card">
  <div class="card-body">
    <small>
  ${formatHours(forecast.dt * 1000)}
  <div class="icon-image">
  <img src="http://openweathermap.org/img/wn/${
    forecast.weather[0].icon
  }@2x.png" alt="weather-icon" />
  </div>
  <div class="weather-forecast-temperature">
  ${Math.round(forecast.main.temp_max)}° | ${Math.round(
      forecast.main.temp_min
    )}°</small>
    </div>
    </div>
    </div>
    </div>
    `;
  }
}

//searches city in openweather API and gets data from it
function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(getLocationInfo).then(showCityWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showForecast);
}

//changes city name in app and clears search box
function changeCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
  let cityInput = document.querySelector("#city-input");
  cityInput.value = "";
}

//fills out weather data of city
function showCityWeather(response) {
  let city = document.querySelector("#city-name");
  let currentTemperature = document.querySelector("#current-temperature");
  let dateElement = document.querySelector("#current-time");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  city.innerHTML = response.data.name.toUpperCase();
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  //changes image source in HTML
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

//asks for permission to get current location
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

//searches location in openweather API and gets data from it
function showCurrentLocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(getLocationInfo).then(showCurrentCity);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
  console.log(apiUrl);
}

//gets position coords for weather forecast
function getLocationInfo(response) {
  cityName = response.data.name;
  latitude = response.data.coord.lat;
  longitude = response.data.coord.lon;
  return response;
}

//fills out weather data of location
function showCurrentCity(response) {
  let city = document.querySelector("#city-name");
  let dateElement = document.querySelector("#current-time");
  let currentTemperature = document.querySelector("#current-temperature");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");

  celsiusTemperature = response.data.main.temp;

  city.innerHTML = response.data.name.toUpperCase();
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
}

//changes forecast temperature from fahrenheit into celsius
function getForecastCelsius() {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
}

//changes forecast temperature from celsius into fahrenheit
function getForecastFahrenheit() {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
}

//changes temperature from celsius into fahrenheit
function showFahrenheitTemperature(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  let temperatureUnit = document.querySelector("#temperature-unit");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32; //formula for converting celsius to fahrenheit

  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
  temperatureUnit.innerHTML = "F";

  getForecastFahrenheit();
}

//changes temperature from fahrenheit into celsius
function showCelsiusTemperature(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  let temperatureUnit = document.querySelector("#temperature-unit");

  currentTemperature.innerHTML = Math.round(celsiusTemperature);
  temperatureUnit.innerHTML = "C";

  getForecastCelsius();
}

//global variables
let celsiusTemperature = null;
let unit = "metric";
let latitude = null;
let longitude = null;
let apiKey = "285f7dfb6ea9613847e41d2341dd08f1";

let cityName = document.querySelector("#search-form");
cityName.addEventListener("submit", changeCity);

let currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitUnit = document.querySelector("#fahrenheit");
fahrenheitUnit.addEventListener("click", showFahrenheitTemperature);

let celsiusUnit = document.querySelector("#celsius");
celsiusUnit.addEventListener("click", showCelsiusTemperature);

//default city
search("Hamburg");
