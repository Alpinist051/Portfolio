import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface SpaceHeroProps {
  preloadedVideo?: HTMLVideoElement;
}

const SpaceHero = ({ preloadedVideo }: SpaceHeroProps) => {
  const [stage, setStage] = useState(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const fullText = "AI / ML ENGINEER  •  FULL STACK, MOBILE & PHP DEVELOPER";

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

  // Typewriter effect
  useEffect(() => {
    if (stage < 2) return;

    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 60);

      return () => clearInterval(typeInterval);
    }, 800);

    return () => clearTimeout(startDelay);
  }, [stage]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Handle preloaded video
  useEffect(() => {
    if (preloadedVideo && videoElementRef.current) {
      // Replace the current video element with the preloaded one
      const currentVideo = videoElementRef.current;
      const parent = currentVideo.parentNode;
      if (parent) {
        parent.replaceChild(preloadedVideo, currentVideo);
        // Start playing the video when the hero section is displayed
        const playPromise = preloadedVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silently handle autoplay failure
          });
        }
      }
    }
  }, [preloadedVideo]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const x = (e.clientX - rect.left - centerX) / centerX;
      const y = (e.clientY - rect.top - centerY) / centerY;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#020205]"
    >
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
        {/* In your SpaceHero component video element */}
        <video
          ref={videoElementRef}
          autoPlay={!!preloadedVideo}
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover opacity-70"
          onError={(e) => {
            // Fallback to a local video or placeholder
            const target = e.target as HTMLVideoElement;
            target.src = "/fallback-video.mp4"; // Add a local video file
            // OR use a solid color as backup
            // target.style.display = 'none';
            // target.parentElement.style.backgroundColor = '#0a0a15';
          }}
        >
          {!preloadedVideo && (
            <source
              src="https://adstorm.co/videos/AdStormAdvertiser.webm"
              type="video/webm"
            />
          )}
          {/* Add a backup source if needed */}
          {/* <source src="/local-background.mp4" type="video/mp4" /> */}
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/80" />
      </motion.div>
      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        {/* SENIOR text container with sparks */}
        <motion.div
          className="relative"
          style={{
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
          }}
        >
          {/* Floating particle sparks with parallax */}
          {stage >= 1 && sparks.map((spark) => (
            <motion.div
              key={spark.id}
              className="pointer-events-none absolute"
              style={{
                left: `${spark.x}%`,
                top: `${spark.y}%`,
                width: spark.size,
                height: spark.size,
                transform: `translate(${mousePosition.x * (20 + spark.id * 2)}px, ${mousePosition.y * (20 + spark.id * 2)}px)`,
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
                  background: `radial-gradient(circle, ${spark.id % 3 === 0
                    ? "rgba(255, 220, 100, 1)"
                    : spark.id % 3 === 1
                      ? "rgba(255, 150, 50, 1)"
                      : "rgba(255, 255, 200, 1)"
                    }, transparent)`,
                  boxShadow: `0 0 ${spark.size * 2}px ${spark.id % 2 === 0
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

            {/* 3D shadow layers with parallax */}
            <motion.span
              className="absolute font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
              style={{
                color: "rgba(40, 15, 0, 0.8)",
                transform: `translate(${8 + mousePosition.x * 5}px, ${10 + mousePosition.y * 5}px)`,
              }}
            >
              SENIOR
            </motion.span>
            <motion.span
              className="absolute font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
              style={{
                color: "rgba(80, 30, 0, 0.6)",
                transform: `translate(${5 + mousePosition.x * 3}px, ${6 + mousePosition.y * 3}px)`,
              }}
            >
              SENIOR
            </motion.span>
            <motion.span
              className="absolute font-display text-7xl font-bold tracking-wider sm:text-8xl md:text-9xl lg:text-[11rem]"
              style={{
                color: "rgba(120, 50, 0, 0.4)",
                transform: `translate(${3 + mousePosition.x * 1.5}px, ${3 + mousePosition.y * 1.5}px)`,
              }}
            >
              SENIOR
            </motion.span>

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
        </motion.div>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
          style={{
            transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px)`,
          }}
        >
          <div className="relative inline-block">
            <span
              className="font-body text-base tracking-[0.3em] sm:text-lg md:text-xl"
              style={{
                background: "linear-gradient(90deg, #888888, #ffffff, #888888)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 30px rgba(255, 150, 0, 0.3)",
              }}
            >
              {typedText}
            </span>
            {/* Blinking cursor */}
            <span
              className="inline-block w-[2px] h-5 sm:h-6 md:h-7 ml-1 align-middle"
              style={{
                backgroundColor: showCursor && typedText.length < fullText.length ? "#ffd700" : "transparent",
                boxShadow: showCursor && typedText.length < fullText.length ? "0 0 10px rgba(255, 200, 0, 0.8)" : "none",
              }}
            />
          </div>
        </motion.div>

        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            stage >= 2 && typedText.length === fullText.length
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 h-[2px] w-64 sm:w-80 md:w-[500px] origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 150, 0, 0.8), rgba(255, 200, 50, 1), rgba(255, 150, 0, 0.8), transparent)",
            transform: `translate(${mousePosition.x * -5}px, 0)`,
          }}
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
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