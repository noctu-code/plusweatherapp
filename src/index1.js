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

function showForecast(response) {
  let forecastElement = document.querySelector("#temperatureforecast1");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2">
    <div class="card">
  <div class="card-body">
    <small>
  ${formatHours(forecast.dt * 1000)}
  <img src="http://openweathermap.org/img/wn/${
    forecast.weather[0].icon
  }@2x.png" alt="weather-icon" sizes="10px" />
  <div class="weather-forecast-temperature">
  ${Math.round(forecast.main.temp_max)}°C | ${Math.round(
      forecast.main.temp_min
    )}°C</small>
    </div>
    </div>
    </div>
    </div>
    `;
  }
}

function changeCity(event) {
  event.preventDefault();
  let searchedCity = document.querySelector(".form-control");
  let newCity = document.querySelector("#city-name");

  newCity.innerHTML = `${searchedCity.value.toUpperCase()}`;

  let apiKey = "285f7dfb6ea9613847e41d2341dd08f1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity.innerHTML}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showCityWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${newCity.innerHTML}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showCityWeather(response) {
  let currentTemperature = document.querySelector("#current-temperature");
  let dateElement = document.querySelector("#current-time");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");

  celsiusTemperature = response.data.main.temp;

  currentTemperature.innerHTML = Math.round(celsiusTemperature);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
}

function showCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "285f7dfb6ea9613847e41d2341dd08f1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showCurrentCity);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

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

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let cityName = document.querySelector("#search-form");
cityName.addEventListener("submit", changeCity);

let currentLocationButton = document.querySelector(".location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitUnit = document.querySelector("#option2");
fahrenheitUnit.addEventListener("click", showFahrenheitTemperature);

let celsiusUnit = document.querySelector("#option1");
celsiusUnit.addEventListener("click", showCelsiusTemperature);
