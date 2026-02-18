import { motion, Variants } from "framer-motion";
import mainIcon from "@/assets/mainIconsdark.svg";
import blackholeVideo from "@/assets/blackhole.webm";
import Particles from "./Particles";

const SpaceHero = () => {
  const headline = "Engineering Intelligence";
  const letters = headline.split("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.9 },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 45, filter: "blur(9px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 105, damping: 13 },
    },
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#030014" }}
    >
      {/* Subtle breathing background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(30,60,120,0.10) 0%, transparent 65%)",
        }}
        animate={{ opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "reverse" }}
      />

      <Particles />

      {/* Blackhole video – unchanged */}
      <motion.div
        className="absolute -top-[40%] left-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[700px] md:h-[700px] z-[1] pointer-events-none"
        initial={{ opacity: 0, scale: 0.9, x: "-50%", rotate: 180 }}
        animate={{ opacity: 1, scale: 1, x: "-50%", rotate: 180 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <video
          src={blackholeVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </motion.div>

      {/* Slightly larger glowing aura */}
      <motion.div
        className="absolute z-[1] w-[280px] h-[280px] rounded-full blur-3xl opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.28) 15%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.10, 1],
          opacity: [0.45, 0.70, 0.45],
        }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Central icon – unchanged from last version */}
      <motion.div
        className="relative z-[2] mt-[12vh] md:mt-[10vh]"
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.img
          src={mainIcon}
          alt="Main icon"
          className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] object-contain drop-shadow-[0_0_35px_rgba(34,211,238,0.55)]"
          initial={{ opacity: 0, scale: 0.4, y: 60, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.6, delay: 0.6, type: "spring", stiffness: 100, damping: 13 }}
        />

        {/* Orbiting particles – unchanged */}
        {[...Array(4)].map((_, i) => {
          const angle = (i * 90 * Math.PI) / 180;
          const radius = 100;
          const duration = 7 + i * 1.3;

          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-cyan-400/55 blur-md pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.75, 0],
                x: [0, Math.cos(angle) * radius, Math.cos(angle + Math.PI) * radius, 0],
                y: [0, Math.sin(angle) * radius, Math.sin(angle + Math.PI) * radius, 0],
                scale: [0.7, 1.25, 0.7],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>

      {/* Text content */}
      <motion.div
        className="relative z-10 text-center mt-12 px-6 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="font-mono text-sm sm:text-base tracking-[0.4em] uppercase text-cyan-400/60 mb-6">
          Senior AI/ML & Full Stack Developer
        </p>

        {/* Headline – made smaller (only this part changed) */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight hero-gradient-text">
          {letters.map((char, idx) => (
            <motion.span
              key={idx}
              variants={letterVariants}
              className="inline-block"
              style={{ textShadow: "0 0 18px rgba(34,211,238,0.65)" }}
              animate={{
                textShadow: [
                  "0 0 18px rgba(34,211,238,0.65)",
                  "0 0 40px rgba(34,211,238,0.95)",
                  "0 0 18px rgba(34,211,238,0.65)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: idx * 0.11 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-7 text-lg sm:text-xl text-gray-300/75 max-w-3xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1.1 }}
        >
          Where code meets cognition — building systems that think, learn, and scale.
        </motion.p>

        {/* Decorative line */}
        <motion.div
          className="mt-12 mx-auto h-px w-36 md:w-48"
          style={{
            background: "linear-gradient(90deg, transparent, #22d3ee70, #3b82f670, transparent)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2.2 }}
        />

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 1.2 }}
        >
          <span className="text-sm font-mono tracking-[0.35em] uppercase text-cyan-300/55">Scroll to explore</span>

          <motion.div
            className="w-1.5 h-10 rounded-full bg-gradient-to-b from-cyan-400/55 to-transparent"
            animate={{ scaleY: [0.6, 1.25, 0.6], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SpaceHero;