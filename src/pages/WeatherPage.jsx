import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import {
  fetchWeather,
  fetchWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
  isDay as checkIsDay,
} from "@/lib/weather";
import { SearchBar } from "@/components/SearchBar";
import { WeatherCard } from "@/components/WeatherCard";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { WeatherBackground } from "@/components/WeatherBackground";

const DEFAULT_CITY = "London";

export default function WeatherPage() {
  const [weather, setWeather]   = useState(null);
  const [daily, setDaily]       = useState([]);
  const [hourly, setHourly]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError]       = useState(null);
  const [lastCity, setLastCity] = useState(DEFAULT_CITY);

  const loadWeather = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [w, forecast] = await Promise.all([
        fetchWeather(city),
        fetchForecast(city),
      ]);
      setWeather(w);
      setDaily(forecast.daily);
      setHourly(forecast.hourly);
      setLastCity(city);
    } catch (e) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const [w, forecast] = await Promise.all([
            fetchWeatherByCoords(lat, lon),
            fetchForecastByCoords(lat, lon),
          ]);
          setWeather(w);
          setDaily(forecast.daily);
          setHourly(forecast.hourly);
          setLastCity(w.city);
          setError(null);
        } catch (e) {
          setError(e.message ?? "Failed to get weather for your location.");
        } finally {
          setLocating(false);
          setLoading(false);
        }
      },
      () => {
        setLocating(false);
        setError("Location access denied. Please search for a city manually.");
      }
    );
  }, []);

  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, [loadWeather]);

  const day       = weather ? checkIsDay(weather) : true;
  const condition = weather?.condition ?? "Clear";

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <WeatherBackground condition={condition} isDay={day} />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 pt-6 pb-4"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-white font-semibold text-xl tracking-tight">Weather</h1>
                {weather && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/60 text-xs mt-0.5"
                  >
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </motion.p>
                )}
              </div>
              {weather && (
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 180 }}
                  onClick={() => loadWeather(lastCity)}
                  className="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  title="Refresh"
                  data-testid="button-refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              )}
            </div>
            <SearchBar
              onSearch={loadWeather}
              onLocate={loadByLocation}
              loading={loading}
              locating={locating}
            />
          </div>
        </motion.header>

        {/* Content */}
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-8 flex flex-col items-center gap-4 text-center"
                  data-testid="error-message"
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-300" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">Oops!</p>
                    <p className="text-white/70 text-sm mt-1 max-w-xs">{error}</p>
                  </div>
                  <button
                    onClick={() => loadWeather(lastCity)}
                    className="px-5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                    data-testid="button-retry"
                  >
                    Try again
                  </button>
                </motion.div>
              )}

              {loading && !error && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-20 flex flex-col items-center gap-4"
                  data-testid="loading-state"
                >
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-white/70"
                        animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-white/60 text-sm">Fetching weather...</p>
                </motion.div>
              )}

              {weather && !loading && !error && (
                <motion.div
                  key={`weather-${weather.city}-${weather.dt}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 flex flex-col gap-4"
                >
                  <WeatherCard weather={weather} />
                  {hourly.length > 0 && <HourlyForecast hourly={hourly} />}
                  {daily.length > 0 && <DailyForecast daily={daily} />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
