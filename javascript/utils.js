const dayConverter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });

export const formatCurrentWeather = (current, daily) => {
  return {
    temperatureCurrent: Math.round(current.temperature_2m),
    temperatureMax: Math.round(daily.temperature_2m_max[0]),
    temperatureMin: Math.round(daily.temperature_2m_min[0]),
    humidity: current.relativehumidity_2m,
    windspeed: current.windspeed_10m,
    precipitation: Math.round(current.precipitation),
    weatherCode: current.weathercode,
  };
};

export const formatHourlyWeather = (hourly) => {
  const currentTime = Date.now();

  const allHours = hourly.time.map((seconds, index) => ({
    time: seconds * 1000,
    temperature: Math.round(hourly.temperature_2m[index]),
    weatherCode: hourly.weathercode[index],
  }));

  const next24Hours = allHours
    .filter((hour) => hour.time >= currentTime)
    .slice(0, 24);

  return next24Hours;
};

export const formatDailyWeather = (daily) => {
  const allDays = daily.time.map((seconds, index) => ({
    day: dayConverter.format(seconds * 1000),
    weatherCode: daily.weathercode[index],
    temperatureMax: Math.round(daily.temperature_2m_max[index]),
    temperatureMin: Math.round(daily.temperature_2m_min[index]),
  }));

  const oneWeek = allDays.slice(1);
  return oneWeek;
};
