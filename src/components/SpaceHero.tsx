import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Spotlight beams */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main center spotlight */}
        <div 
          className="absolute left-1/2 top-0 h-full w-[500px] -translate-x-1/2"
          style={{
            background: 'linear-gradient(180deg, rgba(255,248,240,0.15) 0%, rgba(255,248,240,0.05) 30%, transparent 70%)',
            clipPath: 'polygon(40% 0%, 60% 0%, 75% 100%, 25% 100%)',
          }}
        />
        
        {/* Left magenta spotlight */}
        <div 
          className="absolute left-[20%] top-0 h-full w-[400px] -translate-x-1/2"
          style={{
            background: 'linear-gradient(180deg, rgba(255,0,170,0.2) 0%, rgba(255,0,170,0.08) 40%, transparent 80%)',
            clipPath: 'polygon(35% 0%, 65% 0%, 80% 100%, 20% 100%)',
          }}
        />
        
        {/* Right cyan spotlight */}
        <div 
          className="absolute right-[20%] top-0 h-full w-[400px] translate-x-1/2"
          style={{
            background: 'linear-gradient(180deg, rgba(0,212,255,0.2) 0%, rgba(0,212,255,0.08) 40%, transparent 80%)',
            clipPath: 'polygon(35% 0%, 65% 0%, 80% 100%, 20% 100%)',
          }}
        />
      </div>

      {/* Human silhouette with glow */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
        <div className="relative mb-0 h-[75%] w-[280px]">
          {/* Rim light glow - left magenta */}
          <motion.div 
            className="absolute inset-0"
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: 'linear-gradient(90deg, rgba(255,0,170,0.4) 0%, transparent 30%)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* Rim light glow - right cyan */}
          <motion.div 
            className="absolute inset-0"
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            style={{
              background: 'linear-gradient(-90deg, rgba(0,212,255,0.4) 0%, transparent 30%)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* Top light glow */}
          <motion.div 
            className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: 'radial-gradient(circle, rgba(255,248,240,0.5) 0%, transparent 70%)',
              filter: 'blur(15px)',
            }}
          />
          
          {/* Human silhouette */}
          <svg 
            viewBox="0 0 200 500" 
            className="absolute inset-0 h-full w-full"
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,248,240,0.2))' }}
          >
            {/* Head */}
            <ellipse cx="100" cy="35" rx="28" ry="32" fill="#0a0a12" />
            
            {/* Neck */}
            <rect x="88" y="65" width="24" height="25" fill="#0a0a12" />
            
            {/* Shoulders & Torso */}
            <path 
              d="M 40 90 Q 50 85 100 85 Q 150 85 160 90 L 155 95 Q 155 180 145 200 L 140 220 Q 130 280 120 300 L 80 300 Q 70 280 60 220 L 55 200 Q 45 180 45 95 Z" 
              fill="#0a0a12"
            />
            
            {/* Left Arm */}
            <path 
              d="M 40 95 Q 25 100 20 130 Q 15 160 18 200 Q 20 230 25 250 L 35 250 Q 38 230 36 200 Q 34 170 40 140 Q 45 115 50 100 Z" 
              fill="#0a0a12"
            />
            
            {/* Right Arm */}
            <path 
              d="M 160 95 Q 175 100 180 130 Q 185 160 182 200 Q 180 230 175 250 L 165 250 Q 162 230 164 200 Q 166 170 160 140 Q 155 115 150 100 Z" 
              fill="#0a0a12"
            />
            
            {/* Left Leg */}
            <path 
              d="M 75 300 Q 70 350 68 400 Q 66 450 70 500 L 95 500 Q 92 450 90 400 Q 88 350 90 300 Z" 
              fill="#0a0a12"
            />
            
            {/* Right Leg */}
            <path 
              d="M 125 300 Q 130 350 132 400 Q 134 450 130 500 L 105 500 Q 108 450 110 400 Q 112 350 110 300 Z" 
              fill="#0a0a12"
            />
            
            {/* Highlight edges - left side (magenta tint) */}
            <path 
              d="M 40 95 Q 25 100 20 130 Q 15 160 18 200 Q 20 230 25 250" 
              stroke="rgba(255,0,170,0.5)" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d="M 40 90 Q 45 180 55 200 L 60 220 Q 70 280 75 300 Q 70 350 68 400 Q 66 450 70 500" 
              stroke="rgba(255,0,170,0.4)" 
              strokeWidth="2" 
              fill="none"
            />
            <ellipse cx="100" cy="35" rx="28" ry="32" stroke="rgba(255,0,170,0.3)" strokeWidth="2" fill="none" 
              style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            />
            
            {/* Highlight edges - right side (cyan tint) */}
            <path 
              d="M 160 95 Q 175 100 180 130 Q 185 160 182 200 Q 180 230 175 250" 
              stroke="rgba(0,212,255,0.5)" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d="M 160 90 Q 155 180 145 200 L 140 220 Q 130 280 125 300 Q 130 350 132 400 Q 134 450 130 500" 
              stroke="rgba(0,212,255,0.4)" 
              strokeWidth="2" 
              fill="none"
            />
            
            {/* Top highlight */}
            <ellipse cx="100" cy="20" rx="15" ry="8" fill="rgba(255,248,240,0.15)" />
          </svg>
          
          {/* Floor reflection */}
          <div 
            className="absolute -bottom-20 left-1/2 h-24 w-[200px] -translate-x-1/2"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,248,240,0.1) 0%, transparent 70%)',
            }}
          />
        </div>
      </div>

      {/* Floor glow */}
      <div 
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(0deg, rgba(10,10,18,0.8) 0%, transparent 100%)',
        }}
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,2,5,0.8)_80%,rgba(2,2,5,1)_100%)]" />

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