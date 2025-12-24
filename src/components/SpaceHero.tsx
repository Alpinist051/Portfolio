import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SpaceHero = () => {
  const [stage, setStage] = useState(0); // 0: blur, 1: clear, 2: video expand

  useEffect(() => {
    // Stage 1: Text becomes clear
    const timer1 = setTimeout(() => setStage(1), 500);
    // Stage 2: Video expands
    const timer2 = setTimeout(() => setStage(2), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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

          {/* Main glossy text */}
          <span
            className="relative font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
            style={{
              background: "linear-gradient(180deg, #fffacd 0%, #ffd700 15%, #ff8c00 40%, #ff4500 70%, #8b0000 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 60px rgba(255, 100, 0, 0.5), 0 0 120px rgba(255, 50, 0, 0.3)",
            }}
          >
            SENIOR
          </span>

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

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={stage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="font-body text-lg tracking-widest text-muted-foreground sm:text-xl md:text-2xl">
            AI AUTOMATION SPECIALIST
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
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