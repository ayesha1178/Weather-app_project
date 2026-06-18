import { motion } from "framer-motion";
import sunImg from "../assets/sun_1781787222070.png";
import moonImg from "../assets/moon_1781787222067.png";
import cloudImg from "../assets/cloud_1781787222067.png";
import rainImg from "../assets/rain_1781787222068.png";
import snowImg from "../assets/snow_1781787222068.png";
import stormImg from "../assets/storm_1781787222069.png";

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-20 h-20",
  lg: "w-36 h-36",
};

function getAsset(condition, isDay) {
  if (!isDay) return moonImg;
  switch (condition) {
    case "Clear":        return sunImg;
    case "Clouds":       return cloudImg;
    case "Rain":
    case "Drizzle":      return rainImg;
    case "Thunderstorm": return stormImg;
    case "Snow":         return snowImg;
    default:             return sunImg;
  }
}

export function WeatherIcon({ condition, isDay, size = "md", animated = true }) {
  const cls = sizeMap[size];
  const src = getAsset(condition, isDay);

  if (!animated) {
    return (
      <img
        src={src}
        alt={condition}
        className={`${cls} object-contain drop-shadow-xl`}
      />
    );
  }

  const isSun   = isDay && condition === "Clear";
  const isMoon  = !isDay;
  const isCloud = ["Clouds", "Mist", "Fog", "Haze"].includes(condition);

  return (
    <div className={`relative ${cls}`}>
      {isSun && (
        <motion.div
          className="absolute inset-[-30%] rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.12, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(253,224,71,0.5) 0%, rgba(251,191,36,0.15) 60%, transparent 80%)",
          }}
        />
      )}

      <motion.img
        src={src}
        alt={condition}
        className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
        animate={
          isSun
            ? { y: [0, -8, 0], rotate: [0, 5, 0, -5, 0] }
            : isMoon
            ? { y: [0, -6, 0], rotate: [0, 4, 0, -4, 0] }
            : isCloud
            ? { x: [0, 6, 0, -6, 0], y: [0, -3, 0] }
            : { y: [0, -6, 0] }
        }
        transition={{
          duration: isSun ? 4 : isMoon ? 6 : isCloud ? 5 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {isSun && (
        <motion.div
          className="absolute inset-[-10%] rounded-full border-2 border-yellow-300/30"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            scale:  { duration: 3,  repeat: Infinity },
          }}
          style={{ borderStyle: "dashed" }}
        />
      )}
    </div>
  );
}
