const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeather(city) {
  const res = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error("City not found. Please check the spelling and try again.");
    if (res.status === 401) throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
    throw new Error("Failed to fetch weather data. Please try again.");
  }
  const data = await res.json();
  return mapWeatherData(data);
}

export async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch weather for your location.");
  const data = await res.json();
  return mapWeatherData(data);
}

export async function fetchForecast(city) {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch forecast.");
  const data = await res.json();
  return mapForecastData(data);
}

export async function fetchForecastByCoords(lat, lon) {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch forecast for your location.");
  const data = await res.json();
  return mapForecastData(data);
}

function mapWeatherData(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6),
    windDeg: data.wind.deg ?? 0,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    condition: data.weather[0].main,
    visibility: Math.round((data.visibility ?? 10000) / 1000),
    pressure: data.main.pressure,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    dt: data.dt,
  };
}

function mapForecastData(data) {
  const list = data.list;

  const hourly = list.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    condition: item.weather[0].main,
    pop: Math.round((item.pop ?? 0) * 100),
  }));

  const dailyMap = new Map();
  for (const item of list) {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric",
    });
    if (!dailyMap.has(date)) dailyMap.set(date, []);
    dailyMap.get(date).push(item);
  }

  const daily = [];
  for (const [, items] of dailyMap) {
    const temps = items.map((i) => i.main.temp);
    const midItem = items[Math.floor(items.length / 2)];
    daily.push({
      dt: midItem.dt,
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      description: midItem.weather[0].description,
      icon: midItem.weather[0].icon,
      condition: midItem.weather[0].main,
      humidity: midItem.main.humidity,
      windSpeed: Math.round(midItem.wind.speed * 3.6),
      pop: Math.round(Math.max(...items.map((i) => i.pop ?? 0)) * 100),
    });
    if (daily.length === 5) break;
  }

  return { daily, hourly };
}

export function getWindDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatTime(unix, timezone) {
  const utc = unix + timezone;
  const d = new Date(utc * 1000);
  const hours = d.getUTCHours();
  const mins = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${mins} ${ampm}`;
}

export function formatHour(unix) {
  const d = new Date(unix * 1000);
  const hours = d.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}${ampm}`;
}

export function formatDay(unix) {
  return new Date(unix * 1000).toLocaleDateString("en-US", { weekday: "short" });
}

export function getConditionGradient(condition, isDay) {
  if (!isDay) return "from-slate-900 via-slate-800 to-indigo-950";
  switch (condition) {
    case "Clear":       return "from-sky-400 via-blue-400 to-blue-500";
    case "Clouds":      return "from-slate-400 via-gray-400 to-slate-500";
    case "Rain":
    case "Drizzle":     return "from-slate-600 via-slate-500 to-blue-700";
    case "Thunderstorm":return "from-slate-800 via-slate-700 to-purple-900";
    case "Snow":        return "from-slate-200 via-blue-100 to-slate-300";
    case "Mist":
    case "Fog":
    case "Haze":        return "from-gray-400 via-gray-300 to-slate-400";
    default:            return "from-sky-400 via-blue-400 to-blue-500";
  }
}

export function isDay(weather) {
  const now     = weather.dt      + weather.timezone;
  const sunrise = weather.sunrise + weather.timezone;
  const sunset  = weather.sunset  + weather.timezone;
  return now >= sunrise && now <= sunset;
}
