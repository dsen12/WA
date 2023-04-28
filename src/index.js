let currentDate = new Date();

let year = currentDate.getFullYear();
let date = currentDate.getDate();

let hours = currentDate.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = currentDate.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let day = days[currentDate.getDay()];

let monthsIndex = currentDate.getMonth();
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let month = months[monthsIndex];

document.querySelector("#current-time").innerHTML = `${hours}:${minutes}`;
document.querySelector("#current-date").innerHTML = `${day} <br /> ${date} ${month} ${year}`;


function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
      <img
      src="images/${forecastDay.weather[0].icon}.png"
      alt=""
      width="40"
      />
      <div class="weather-forecast-temperatures">
      <div class="weather-forecast-temperature-max" id="max"> ${Math.round(
        forecastDay.temp.max
        )}°</div>
        <div class="weather-forecast-temperature-min" id="min"> ${Math.round(
          forecastDay.temp.min
          )}°</div>
          <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getFutureForecast(coordinates) {
  console.log(coordinates);
  let units = "metric";
  let apiKey = "a5acb752426cd8188485c35694980e3a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={current,minutely,hourly,alerts}&appid=${apiKey}&units=${units}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showCurrentLocationTemp(response) {
  let countryCode = response.data.sys.country;
  let regionNamesInEnglish = new Intl.DisplayNames(['en'], {type:'region'});
  let countryName = (regionNamesInEnglish.of(countryCode));
  document.querySelector("#country-name").innerHTML = (countryName);
  document.querySelector("#city-name").innerHTML = response.data.name;

  celsiusTemperature = response.data.main.temp;
  document.querySelector("#current-temp").innerHTML = Math.round(celsiusTemperature); 
  document.querySelector("#description").innerHTML = (response.data.weather[0].main);
  
  document.querySelector("#humidity-info").innerHTML = `${response.data.main.humidity}%`;
  document.querySelector("#wind-info").innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `images/${response.data.weather[0].icon}.png`)
  iconElement.setAttribute("alt", response.data.weather[0].description)

  getFutureForecast(response.data.coord);
}

function searchCity(city) {
  let units = "metric";
  let apiKey = "515c9ddbeb3cda9061acfab71031839e"
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
  
  axios.get(apiUrl).then(showCurrentLocationTemp);
}

function cityInput(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", cityInput);

function showCurrentPosition(position) {
  let units = "metric";
  let apiKey = "515c9ddbeb3cda9061acfab71031839e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showCurrentLocationName);
}
function showCurrentLocationName(response){
  let units = "metric";
  let apiKey = "515c9ddbeb3cda9061acfab71031839e";
  let city = response.data.name;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
  axios.get(apiUrl).then(showCurrentLocationTemp);
}
function currentLocationWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentPosition);
}

function changeToFarenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  let farenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemp);
  document.querySelector("#farenheit").style.color = "#2F3E46";
  document.querySelector("#celsius").style.color = "#84A98C";
}

function changeToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  document.querySelector("#farenheit").style.color = "#84A98C";
  document.querySelector("#celsius").style.color = "#2F3E46";
  }

let celsiusTemperature = null;

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", currentLocationWeather);

let farenheitLink = document.querySelector("#farenheit");
farenheitLink.addEventListener("click", changeToFarenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", changeToCelsius);

searchCity("Vancouver")