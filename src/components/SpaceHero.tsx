import { motion } from "framer-motion";
import scientistImage from "@/assets/scientist-hero.png";

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Rotating camera container */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          rotateY: [0, 5, 0, -5, 0],
          scale: [1, 1.02, 1, 1.02, 1],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ 
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
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

        {/* Human Image with animations */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Glow effects around the image */}
            <div 
              className="absolute inset-0 -z-10"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,250,245,0.15) 0%, transparent 50%)',
                filter: 'blur(40px)',
                transform: 'scale(1.5)',
              }}
            />
            
            {/* The human image with smile/talking animation */}
            <motion.div
              className="relative"
              animate={{ 
                scaleY: [1, 1.002, 1, 1.001, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <motion.img 
                src={scientistImage} 
                alt="Professional"
                className="h-[70vh] w-auto max-w-[90vw] object-contain"
                animate={{
                  filter: [
                    'drop-shadow(0 0 60px rgba(255,250,245,0.3)) drop-shadow(-30px 0 50px rgba(255,0,170,0.2)) drop-shadow(30px 0 50px rgba(0,212,255,0.2))',
                    'drop-shadow(0 0 80px rgba(255,250,245,0.4)) drop-shadow(-40px 0 60px rgba(255,0,170,0.3)) drop-shadow(40px 0 60px rgba(0,212,255,0.3))',
                    'drop-shadow(0 0 60px rgba(255,250,245,0.3)) drop-shadow(-30px 0 50px rgba(255,0,170,0.2)) drop-shadow(30px 0 50px rgba(0,212,255,0.2))',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Subtle talking/smile overlay animation */}
              <motion.div
                className="absolute bottom-[35%] left-1/2 h-8 w-16 -translate-x-1/2 rounded-full"
                animate={{
                  scaleX: [1, 1.05, 1, 1.03, 1],
                  scaleY: [1, 0.95, 1, 0.97, 1],
                  opacity: [0, 0.05, 0, 0.03, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: 'radial-gradient(ellipse, rgba(255,200,180,0.3) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
            </motion.div>
            
            {/* Floor reflection glow */}
            <div 
              className="absolute -bottom-20 left-1/2 h-40 w-[400px] -translate-x-1/2"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,250,245,0.1) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,2,5,0.7)_65%,rgba(2,2,5,0.95)_100%)]" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
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
    </section>
  );
};

export default SpaceHero;