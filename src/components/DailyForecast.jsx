import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { formatDay } from "@/lib/weather";
import { WeatherIcon } from "./WeatherIcon";

export function DailyForecast({ daily }) {
  const maxTemp = Math.max(...daily.map((d) => d.tempMax));
  const minTemp = Math.min(...daily.map((d) => d.tempMin));
  const range = maxTemp - minTemp || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
    >
      <h3 className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-4">
        5-Day Forecast
      </h3>
      <div className="flex flex-col gap-2">
        {daily.map((day, i) => {
          const lowPct  = ((day.tempMin - minTemp) / range) * 60;
          const highPct = ((day.tempMax - minTemp) / range) * 60;

          return (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors"
              data-testid={`daily-${i}`}
            >
              <span className="text-white/70 font-medium text-sm w-8">
                {i === 0 ? "Today" : formatDay(day.dt)}
              </span>

              <WeatherIcon condition={day.condition} isDay size="sm" animated={false} />

              {day.pop > 0 ? (
                <div className="flex items-center gap-0.5 min-w-[36px]">
                  <Droplets className="w-3 h-3 text-blue-300" />
                  <span className="text-blue-200 text-xs">{day.pop}%</span>
                </div>
              ) : (
                <div className="min-w-[36px]" />
              )}

              <div className="flex-1 flex items-center gap-2">
                <span className="text-white/50 text-sm font-medium w-8 text-right">{day.tempMin}°</span>
                <div className="flex-1 relative h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-300 via-yellow-300 to-orange-400"
                    initial={{ width: 0, left: `${lowPct}%` }}
                    animate={{ width: `${highPct - lowPct + 15}%`, left: `${lowPct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                  />
                </div>
                <span className="text-white font-semibold text-sm w-8">{day.tempMax}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
