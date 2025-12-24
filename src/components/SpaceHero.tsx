import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const SpaceHero = () => {
  const [stage, setStage] = useState(0);
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1800);

    // Generate sparks after text is clear
    const sparkTimer = setTimeout(() => {
      const newSparks: Spark[] = [];
      for (let i = 0; i < 30; i++) {
        newSparks.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 2 + Math.random() * 4,
          duration: 3 + Math.random() * 4,
          delay: Math.random() * 2,
        });
      }
      setSparks(newSparks);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(sparkTimer);
    };
  }, []);

  const subtitleWords = ["AI / ML ENGINEER", "&", "FULL STACK DEVELOPER"];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#0a0a15] to-[#020205]" />

      {/* Video background - expands from center */}
      <motion.div
        initial={{ scale: 0, opacity: 0, borderRadius: "50%" }}
        animate={
          stage >= 2
            ? { scale: 1.2, opacity: 1, borderRadius: "0%" }
            : { scale: 0, opacity: 0, borderRadius: "50%" }
        }
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-70"
        >
          <source
            src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/80" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        {/* SENIOR text container with sparks */}
        <div className="relative">
          {/* Floating particle sparks */}
          {stage >= 1 && sparks.map((spark) => (
            <motion.div
              key={spark.id}
              className="pointer-events-none absolute"
              style={{
                left: `${spark.x}%`,
                top: `${spark.y}%`,
                width: spark.size,
                height: spark.size,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
                x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80],
                y: [0, -30 - Math.random() * 40, -60 - Math.random() * 50],
              }}
              transition={{
                duration: spark.duration,
                delay: spark.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <div
                className="h-full w-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${
                    spark.id % 3 === 0
                      ? "rgba(255, 220, 100, 1)"
                      : spark.id % 3 === 1
                      ? "rgba(255, 150, 50, 1)"
                      : "rgba(255, 255, 200, 1)"
                  }, transparent)`,
                  boxShadow: `0 0 ${spark.size * 2}px ${
                    spark.id % 2 === 0
                      ? "rgba(255, 200, 50, 0.8)"
                      : "rgba(255, 100, 0, 0.8)"
                  }`,
                }}
              />
            </motion.div>
          ))}

          {/* SENIOR text with blur-to-clear effect */}
          <motion.div
            initial={{ filter: "blur(20px)", opacity: 0, scale: 0.9 }}
            animate={
              stage >= 1
                ? { filter: "blur(0px)", opacity: 1, scale: 1 }
                : { filter: "blur(20px)", opacity: 0.5, scale: 0.9 }
            }
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Pulsing glow effect behind text */}
            {stage >= 2 && (
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div
                  className="h-32 w-full sm:h-40 md:h-48 lg:h-64"
                  style={{
                    background: "radial-gradient(ellipse, rgba(255, 100, 0, 0.4) 0%, rgba(255, 50, 0, 0.2) 40%, transparent 70%)",
                    filter: "blur(30px)",
                  }}
                />
              </motion.div>
            )}

            {/* 3D shadow layers */}
            <span
              className="absolute font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
              style={{
                color: "rgba(40, 15, 0, 0.8)",
                transform: "translate(8px, 10px)",
              }}
            >
              SENIOR
            </span>
            <span
              className="absolute font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
              style={{
                color: "rgba(80, 30, 0, 0.6)",
                transform: "translate(5px, 6px)",
              }}
            >
              SENIOR
            </span>
            <span
              className="absolute font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
              style={{
                color: "rgba(120, 50, 0, 0.4)",
                transform: "translate(3px, 3px)",
              }}
            >
              SENIOR
            </span>

            {/* Main glossy text with animated glow */}
            <motion.span
              className="relative font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
              style={{
                background: "linear-gradient(180deg, #fffacd 0%, #ffd700 15%, #ff8c00 40%, #ff4500 70%, #8b0000 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              animate={
                stage >= 2
                  ? {
                      textShadow: [
                        "0 0 60px rgba(255, 100, 0, 0.5), 0 0 120px rgba(255, 50, 0, 0.3)",
                        "0 0 80px rgba(255, 120, 0, 0.7), 0 0 150px rgba(255, 70, 0, 0.5)",
                        "0 0 60px rgba(255, 100, 0, 0.5), 0 0 120px rgba(255, 50, 0, 0.3)",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              SENIOR
            </motion.span>

            {/* Top glossy highlight overlay */}
            <span
              className="pointer-events-none absolute inset-0 font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 20%, transparent 50%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mixBlendMode: "overlay",
              }}
            >
              SENIOR
            </span>
          </motion.div>
        </div>

        {/* Enhanced Subtitle with word-by-word animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center"
        >
          {subtitleWords.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: -90 }}
              animate={
                stage >= 2
                  ? { opacity: 1, y: 0, rotateX: 0 }
                  : { opacity: 0, y: 30, rotateX: -90 }
              }
              transition={{
                duration: 0.8,
                delay: 0.5 + index * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`font-body tracking-widest ${
                word === "&"
                  ? "text-lg sm:text-xl md:text-2xl"
                  : "text-base sm:text-lg md:text-xl"
              }`}
              style={{
                background:
                  word === "&"
                    ? "linear-gradient(90deg, #ff8c00, #ffd700, #ff8c00)"
                    : "linear-gradient(90deg, #a0a0a0, #ffffff, #a0a0a0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: word === "&" ? "0 0 20px rgba(255, 150, 0, 0.5)" : "none",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={stage >= 2 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 h-[2px] w-64 sm:w-80 md:w-96 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 150, 0, 0.8), rgba(255, 200, 50, 1), rgba(255, 150, 0, 0.8), transparent)",
          }}
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-widest text-muted-foreground">
              SCROLL
            </span>
            <div className="h-10 w-[1px] bg-gradient-to-b from-muted-foreground to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={stage >= 2 ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-1/2 h-[40%] w-[80%] -translate-x-1/2 z-0"
        style={{
          background: "radial-gradient(ellipse at bottom, rgba(255, 80, 0, 0.3) 0%, transparent 70%)",
        }}
      />
    </section>
  );
};

export default SpaceHero;