import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { formatHour } from "@/lib/weather";
import { WeatherIcon } from "./WeatherIcon";

export function HourlyForecast({ hourly }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
    >
      <h3 className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-4">
        Hourly Forecast
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {hourly.map((h, i) => (
          <motion.div
            key={h.dt}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.2)" }}
            className="flex flex-col items-center gap-2 bg-white/5 rounded-xl px-3 py-3 min-w-[64px] border border-white/10 cursor-default transition-colors"
            data-testid={`hourly-${i}`}
          >
            <span className="text-white/60 text-xs font-medium whitespace-nowrap">
              {i === 0 ? "Now" : formatHour(h.dt)}
            </span>
            <WeatherIcon condition={h.condition} isDay size="sm" animated={false} />
            <span className="text-white font-bold text-sm">{h.temp}°</span>
            {h.pop > 0 && (
              <div className="flex items-center gap-0.5">
                <Droplets className="w-3 h-3 text-blue-300" />
                <span className="text-blue-200 text-xs">{h.pop}%</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
