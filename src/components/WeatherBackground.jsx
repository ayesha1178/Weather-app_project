import { motion, AnimatePresence } from "framer-motion";
import bgImg from "@assets/weather-bg_1781787222069.jpg";

export function WeatherBackground({ condition, isDay }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImg})` }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${condition}-${isDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <ColorOverlay condition={condition} isDay={isDay} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          key={`fx-${condition}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          <EffectLayer condition={condition} isDay={isDay} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}

function ColorOverlay({ condition, isDay }) {
  if (!isDay) return <div className="absolute inset-0 bg-indigo-950/60" />;
  switch (condition) {
    case "Clear":
      return <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-sky-400/10 to-transparent" />;
    case "Clouds":
      return <div className="absolute inset-0 bg-slate-500/30" />;
    case "Rain":
    case "Drizzle":
      return <div className="absolute inset-0 bg-slate-700/40" />;
    case "Thunderstorm":
      return <div className="absolute inset-0 bg-slate-900/55" />;
    case "Snow":
      return <div className="absolute inset-0 bg-blue-100/30" />;
    default:
      return null;
  }
}

function EffectLayer({ condition, isDay }) {
  if (!isDay) return <NightStars />;
  switch (condition) {
    case "Rain":
    case "Drizzle":      return <RainParticles />;
    case "Thunderstorm": return <ThunderstormFx />;
    case "Snow":         return <SnowParticles />;
    default:             return null;
  }
}

function RainParticles() {
  const drops = Array.from({ length: 35 }, (_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 0.6 + Math.random() * 0.5,
    height: 10 + Math.random() * 18,
    opacity: 0.35 + Math.random() * 0.45,
  }));

  return (
    <>
      {drops.map((d, i) => (
        <motion.div
          key={i}
          className="absolute w-px rounded-full bg-blue-200"
          style={{ left: `${d.x}%`, height: `${d.height}px`, opacity: d.opacity }}
          animate={{ y: ["0vh", "110vh"] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: "linear" }}
        />
      ))}
    </>
  );
}

function ThunderstormFx() {
  const drops = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
  }));

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: [0, 0, 0, 0, 0.18, 0, 0.1, 0, 0, 0] }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.28, 0.38, 0.39, 0.4, 0.42, 0.43, 0.45, 0.7, 1] }}
      />
      {drops.map((d, i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-slate-300/60"
          style={{ left: `${d.x}%`, height: "22px" }}
          animate={{ y: ["0vh", "110vh"] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: d.delay, ease: "linear" }}
        />
      ))}
    </>
  );
}

function SnowParticles() {
  const flakes = Array.from({ length: 45 }, (_, i) => ({
    x: Math.random() * 100,
    size: 3 + Math.random() * 7,
    delay: Math.random() * 4,
    duration: 3.5 + Math.random() * 3,
    sway: (Math.random() - 0.5) * 50,
  }));

  return (
    <>
      {flakes.map((f, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${f.x}%`, width: `${f.size}px`, height: `${f.size}px`, opacity: 0.85 }}
          animate={{ y: ["0vh", "110vh"], x: [0, f.sway] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: "linear" }}
        />
      ))}
    </>
  );
}

function NightStars() {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 75,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 3,
    duration: 1.5 + Math.random() * 2.5,
  }));

  return (
    <>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px` }}
          animate={{ opacity: [0.15, 1, 0.15], scale: [1, 1.4, 1] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}
