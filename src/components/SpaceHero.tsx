import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SpaceHero = () => {
  const [activeLetterIndex, setActiveLetterIndex] = useState(-1);
  const [showVideo, setShowVideo] = useState(false);
  const letters = "SENIOR".split("");

  useEffect(() => {
    // Sequentially reveal letters with flame effect
    letters.forEach((_, index) => {
      setTimeout(() => {
        setActiveLetterIndex(index);
      }, index * 400 + 500);
    });

    // Show video after all letters are revealed
    const videoTimer = setTimeout(() => {
      setShowVideo(true);
    }, letters.length * 400 + 1200);

    return () => {
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
        {/* SENIOR text with flame-writing animation */}
        <div className="relative flex items-center justify-center">
          <div className="flex">
            {letters.map((letter, index) => {
              const isActive = index <= activeLetterIndex;
              const isCurrentlyWriting = index === activeLetterIndex;

              return (
                <div key={index} className="relative">
                  {/* Flame cursor that writes the letter */}
                  {isCurrentlyWriting && (
                    <>
                      {/* Main flame writing effect */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: [0, 1, 1, 0.8],
                          scale: [0.5, 1.2, 1, 0.8],
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                      >
                        <div 
                          className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-64 lg:w-64 rounded-full"
                          style={{
                            background: "radial-gradient(circle, rgba(255, 200, 50, 0.9) 0%, rgba(255, 100, 0, 0.7) 30%, rgba(255, 50, 0, 0.4) 60%, transparent 80%)",
                            filter: "blur(8px)",
                          }}
                        />
                      </motion.div>

                      {/* Sparks flying from flame */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ 
                            opacity: 1, 
                            scale: 1,
                            x: 0,
                            y: 0,
                          }}
                          animate={{ 
                            opacity: 0,
                            scale: 0,
                            x: (Math.random() - 0.5) * 150,
                            y: -Math.random() * 120 - 20,
                          }}
                          transition={{ 
                            duration: 0.6 + Math.random() * 0.4,
                            delay: Math.random() * 0.2,
                            ease: "easeOut",
                          }}
                          className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-2 w-2 rounded-full"
                          style={{
                            background: i % 2 === 0 
                              ? "rgba(255, 220, 100, 1)" 
                              : "rgba(255, 150, 50, 1)",
                            boxShadow: "0 0 6px rgba(255, 200, 50, 0.8)",
                          }}
                        />
                      ))}
                    </>
                  )}

                  {/* The letter itself */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 0.8,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[12rem]"
                    style={{
                      color: isActive ? "transparent" : "transparent",
                      backgroundImage: isActive 
                        ? "linear-gradient(180deg, #fff 0%, #ffd700 50%, #ff6600 100%)"
                        : "none",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      textShadow: isActive
                        ? "0 0 30px rgba(255, 150, 0, 0.6), 0 0 60px rgba(255, 80, 0, 0.4), 0 0 90px rgba(255, 50, 0, 0.3)"
                        : "none",
                      filter: isCurrentlyWriting ? "brightness(1.3)" : "brightness(1)",
                    }}
                  >
                    {letter}
                  </motion.span>

                  {/* Residual heat glow under letter */}
                  {isActive && !isCurrentlyWriting && (
                    <motion.div
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: [0.6, 0.3, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="pointer-events-none absolute inset-0 -z-10"
                      style={{
                        background: "radial-gradient(ellipse at center bottom, rgba(255, 100, 0, 0.3) 0%, transparent 70%)",
                        filter: "blur(10px)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
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
      {activeLetterIndex >= 0 && (
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
