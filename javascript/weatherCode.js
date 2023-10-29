const WEATHER_CODE = {
  sunny: [0],
  'partly-cloudy': [1, 2],
  cloudy: [3],
  rainy: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 95, 96, 99],
  'rain-showers': [80, 81, 82],
  fog: [45, 48],
  'snow-fall': [71, 73, 75, 77, 85, 86],
};

export const getWeatherType = (weatherCode) => {
  for (let key in WEATHER_CODE) {
    if (WEATHER_CODE[key].includes(weatherCode)) {
      return key;
    }
  }
};
