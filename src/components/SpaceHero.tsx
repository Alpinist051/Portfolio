import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import scientistImage from "@/assets/scientist-hero.png";

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Spotlight beams */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main center spotlight from above */}
        <motion.div 
          className="absolute left-1/2 top-0 h-full w-[600px] -translate-x-1/2"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: 'linear-gradient(180deg, rgba(255,250,245,0.2) 0%, rgba(255,250,245,0.08) 40%, transparent 75%)',
            clipPath: 'polygon(42% 0%, 58% 0%, 72% 100%, 28% 100%)',
          }}
        />
        
        {/* Left magenta accent light */}
        <motion.div 
          className="absolute left-[15%] top-0 h-full w-[350px]"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{
            background: 'linear-gradient(180deg, rgba(255,0,170,0.25) 0%, rgba(255,0,170,0.1) 50%, transparent 85%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)',
          }}
        />
        
        {/* Right cyan accent light */}
        <motion.div 
          className="absolute right-[15%] top-0 h-full w-[350px]"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: 'linear-gradient(180deg, rgba(0,212,255,0.25) 0%, rgba(0,212,255,0.1) 50%, transparent 85%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)',
          }}
        />
      </div>

      {/* Scientist Image */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
        <motion.div 
          className="relative h-[85%] w-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Glow effects around the image */}
          <div 
            className="absolute inset-0 -z-10"
            style={{
              background: 'radial-gradient(ellipse at center top, rgba(255,250,245,0.15) 0%, transparent 50%)',
              filter: 'blur(40px)',
              transform: 'scale(1.3)',
            }}
          />
          
          {/* The scientist image */}
          <img 
            src={scientistImage} 
            alt="Professional Scientist"
            className="h-full w-auto object-contain"
            style={{
              filter: 'drop-shadow(0 0 60px rgba(255,250,245,0.2)) drop-shadow(-20px 0 40px rgba(255,0,170,0.15)) drop-shadow(20px 0 40px rgba(0,212,255,0.15))',
            }}
          />
          
          {/* Floor reflection glow */}
          <div 
            className="absolute -bottom-10 left-1/2 h-20 w-[300px] -translate-x-1/2"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,250,245,0.15) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        </motion.div>
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,2,5,0.7)_65%,rgba(2,2,5,0.95)_100%)]" />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-4 font-body text-sm tracking-[0.3em] text-primary/70"
          >
            SENIOR AI/ML & FULL STACK DEVELOPER
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-6 font-display text-4xl font-bold leading-tight tracking-wider md:text-6xl lg:text-7xl"
          >
            <span className="text-neon">BUILDING</span>{" "}
            <span className="text-foreground">THE</span>
            <br />
            <span className="text-neon-magenta">FUTURE</span>{" "}
            <span className="text-foreground">OF TECH</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mx-auto mb-8 max-w-2xl font-body text-lg text-muted-foreground md:text-xl"
          >
            6+ years crafting intelligent systems, from neural networks to scalable full-stack solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#contact"
              className="group relative overflow-hidden rounded-lg bg-primary px-8 py-3 font-display text-sm font-semibold tracking-wider text-primary-foreground transition-all hover:shadow-neon"
            >
              <span className="relative z-10">INITIATE CONTACT</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent transition-transform group-hover:translate-x-full" />
            </a>
            <Link
              to="/projects"
              className="rounded-lg border border-primary/30 bg-primary/5 px-8 py-3 font-display text-sm font-semibold tracking-wider text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
            >
              VIEW PROJECTS
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-body text-xs tracking-widest text-muted-foreground">SCROLL</span>
            <div className="h-8 w-px bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpaceHero;