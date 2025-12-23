import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SpaceHero = () => {
  const [showFlame, setShowFlame] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const letters = "SENIOR".split("");

  useEffect(() => {
    // Show flame after letters animation completes
    const flameTimer = setTimeout(() => {
      setShowFlame(true);
    }, 1500);

    // Show video after flame effect
    const videoTimer = setTimeout(() => {
      setShowVideo(true);
    }, 2200);

    return () => {
      clearTimeout(flameTimer);
      clearTimeout(videoTimer);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#0a0a15] to-[#020205]" />

      {/* Video background - explosion/flame */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-60"
          >
            <source
              src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/80" />
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        {/* SENIOR text with letter-by-letter animation */}
        <div className="relative flex items-center justify-center">
          <div className="flex overflow-hidden">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display text-7xl font-bold tracking-wider text-white sm:text-8xl md:text-9xl lg:text-[12rem]"
                style={{
                  textShadow: showFlame
                    ? "0 0 60px rgba(255, 100, 0, 0.8), 0 0 120px rgba(255, 50, 0, 0.6)"
                    : "none",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Flame particles effect */}
          {showFlame && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: (Math.random() - 0.5) * 400,
                    y: -Math.random() * 300 - 50,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  className="absolute h-4 w-4 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${
                      i % 3 === 0
                        ? "rgba(255, 200, 50, 0.9)"
                        : i % 3 === 1
                        ? "rgba(255, 100, 0, 0.9)"
                        : "rgba(255, 50, 0, 0.9)"
                    }, transparent)`,
                    filter: "blur(2px)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showVideo ? 1 : 0, y: showVideo ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="font-body text-lg tracking-widest text-muted-foreground sm:text-xl md:text-2xl">
            AI AUTOMATION SPECIALIST
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showVideo ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
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
      {showFlame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 left-1/2 h-[40%] w-[80%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse at bottom, rgba(255, 80, 0, 0.3) 0%, transparent 70%)",
          }}
        />
      )}
    </section>
  );
};

export default SpaceHero;
