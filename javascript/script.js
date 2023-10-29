import { getWeatherType } from './weatherCode.js';
import {
  formatCurrentWeather,
  formatDailyWeather,
  formatHourlyWeather,
} from './utils.js';

//SELECTORS
const openModalBtn = document.querySelector('#open-modal');
const closeModalCross = document.querySelector('#modal-close-cross');
const closeModalBtn = document.querySelector('#modal-close-btn');
const searchInput = document.querySelector('#search-input');
const searchSubmitButton = document.querySelector('#search-submit-btn');
const searchButton = document.querySelector('#search-btn');

//EVENT LISTENERS
openModalBtn.addEventListener('click', openModal);
closeModalCross.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);
searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  handleSearch(searchInput.value);
});
searchSubmitButton.addEventListener('click', (e) => {
  e.preventDefault();
  handleSearch(searchInput.value);
});

renderPage();

async function renderPage(lat = 41.2647, long = 69.2163) {
  try {
    const weatherData = await fetchWeather(lat, long);
    const weather = formatWeatherData(weatherData);
    renderWeather(weather);
    closeModal();
  } catch (error) {
    console.log(error);
  }
}

async function fetchWeather(lat, long) {
  const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const URL =
    'https://api.open-meteo.com/v1/forecast?forecast_days=8&timeformat=unixtime&current=temperature_2m,relativehumidity_2m,weathercode,precipitation,windspeed_10m&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min';

  const response = await fetch(
    URL + `&latitude=${lat}&longitude=${long}&timezone=${TIMEZONE}`
  );

  if (!response.ok) {
    throw new Error('Could not fetch the data from the resource!');
  }

  return await response.json();
}

function formatWeatherData(weatherData) {
  const { current, hourly, daily } = weatherData;

  return {
    currentWeather: formatCurrentWeather(current, daily),
    hourlyWeather: formatHourlyWeather(hourly),
    dailyWeather: formatDailyWeather(daily),
  };
}

function renderWeather(weather) {
  renderCurrentWeather(weather.currentWeather);
  renderHourlyWeather(weather.hourlyWeather);
  renderDailyWeather(weather.dailyWeather);
}

async function handleSearch(place) {
  if (place) {
    try {
      const location = await fetchLocation(place);

      if (location.results) {
        const {
          results: [result],
        } = location;

        document.querySelector('[data-location-name]').textContent =
          result.name;

        renderPage(result.latitude, result.longitude);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

async function fetchLocation(place) {
  const URL =
    'https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&format=json';

  const response = await fetch(URL + `&name=${place}`);

  if (!response.ok) {
    throw new Error('Could not fetch the data from the resource!');
  }

  return await response.json();
}

function renderCurrentWeather(currentWeather) {
  const weatherType = getWeatherType(currentWeather.weatherCode);

  document.querySelector(
    '[data-current-weather-img]'
  ).src = `./assets/icons//weather/${weatherType}.png`;

  document.querySelector('[data-current-temp]').innerHTML =
    currentWeather.temperatureCurrent + '&deg;';

  document.querySelector('[data-min-temp]').innerHTML =
    currentWeather.temperatureMin + '&deg;';

  document.querySelector('[data-max-temp]').innerHTML =
    currentWeather.temperatureMax + '&deg;';

  document.querySelector('[data-current-wind]').textContent =
    currentWeather.windspeed + ' ';

  document.querySelector('[data-current-humidity]').textContent =
    currentWeather.humidity;

  document.querySelector('[data-current-precipitation]').textContent =
    currentWeather.precipitation;
}

function renderHourlyWeather(hourly) {
  const hourConverter = new Intl.DateTimeFormat(undefined, { hour: 'numeric' });
  const hourlyWrapper = document.querySelector('[data-weather-hourly-wrapper]');
  hourlyWrapper.innerHTML = '';

  hourly.forEach((hour) => {
    const weatherType = getWeatherType(hour.weatherCode);

    const hourlyWeather = document.createElement('div');
    hourlyWeather.classList.add('weather-hourly');

    hourlyWeather.innerHTML = `<p class="hourly-temp"><span>${hour.temperature}&deg;</span>C</p>`;

    hourlyWeather.innerHTML += `<img src="./assets/icons/weather/light-size/${weatherType}.png" alt="weather-icon" />`;

    hourlyWeather.innerHTML += `<span>${hourConverter.format(
      hour.time
    )}</span>`;

    hourlyWrapper.append(hourlyWeather);
  });
}

function renderDailyWeather(daily) {
  const dailyWrapper = document.querySelector('[data-weather-daily-wrapper]');
  dailyWrapper.innerHTML = '';

  daily.forEach((day) => {
    const weatherType = getWeatherType(day.weatherCode);

    const dailyWeather = document.createElement('div');
    dailyWeather.classList.add('weather-daily');

    dailyWeather.innerHTML = `<span class="week-day">${day.day}</span>`;

    dailyWeather.innerHTML += `<img src="./assets/icons/weather/light-size/${weatherType}.png" alt="daily-weather-icon" />`;

    dailyWeather.innerHTML += `<div class="temps-container"> <span>${day.temperatureMin}&deg;</span> <span class="max-temp">${day.temperatureMax}&deg;</span> </div>`;

    dailyWrapper.append(dailyWeather);
  });
}

function openModal() {
  document.querySelector('#search-modal').classList.add('active');
}

function closeModal() {
  searchInput.value = '';
  document.querySelector('#search-modal').classList.remove('active');
}
