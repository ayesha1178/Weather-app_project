import { motion } from "framer-motion";
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Thermometer, Navigation } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { formatTime, getWindDirection, isDay as checkIsDay } from "@/lib/weather";

export function WeatherCard({ weather }) {
  const day = checkIsDay(weather);

  const stats = [
    { icon: Droplets,    label: "Humidity",   value: `${weather.humidity}%`,                              color: "text-blue-300" },
    { icon: Wind,        label: "Wind",        value: `${weather.windSpeed} km/h ${getWindDirection(weather.windDeg)}`, color: "text-teal-300" },
    { icon: Eye,         label: "Visibility",  value: `${weather.visibility} km`,                         color: "text-purple-300" },
    { icon: Gauge,       label: "Pressure",    value: `${weather.pressure} hPa`,                          color: "text-orange-300" },
    { icon: Thermometer, label: "Feels like",  value: `${weather.feelsLike}°`,                            color: "text-red-300" },
    { icon: Navigation,  label: "Wind dir.",   value: `${weather.windDeg}°`,                              color: "text-green-300" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      {/* Main temp display */}
      <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-8">
        <div className="mb-4">
          <WeatherIcon condition={weather.condition} isDay={day} size="lg" />
        </div>

        <motion.div
          className="text-[5.5rem] font-thin text-white leading-none tracking-tighter"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          data-testid="text-temperature"
        >
          {weather.temp}°
        </motion.div>

        <motion.p
          className="text-2xl font-light text-white/90 capitalize mt-1"
          variants={itemVariants}
          data-testid="text-description"
        >
          {weather.description}
        </motion.p>

        <motion.div
          className="flex items-center gap-3 mt-2 text-white/70 text-sm font-medium"
          variants={itemVariants}
        >
          <span data-testid="text-temp-range">H:{weather.tempMax}° L:{weather.tempMin}°</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span data-testid="text-city">{weather.city}, {weather.country}</span>
        </motion.div>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.18)" }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex flex-col gap-1.5 transition-colors"
            data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-white/60 text-xs font-medium uppercase tracking-wide">{label}</span>
            </div>
            <span className="text-white font-semibold text-base">{value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Sunrise / Sunset */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-400/20 flex items-center justify-center">
            <Sunrise className="w-5 h-5 text-orange-300" />
          </div>
          <div>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wide">Sunrise</p>
            <p className="text-white font-semibold" data-testid="text-sunrise">
              {formatTime(weather.sunrise, weather.timezone)}
            </p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-400/20 flex items-center justify-center">
            <Sunset className="w-5 h-5 text-pink-300" />
          </div>
          <div>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wide">Sunset</p>
            <p className="text-white font-semibold" data-testid="text-sunset">
              {formatTime(weather.sunset, weather.timezone)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
