import { motion } from "framer-motion";
import { useMemo, useRef, useState, useCallback } from "react";

// Floating particle component
const FloatingParticle = ({ delay, duration, x, size }: { delay: number; duration: number; x: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/30"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      bottom: -10,
    }}
    animate={{
      y: [0, -300, -400],
      opacity: [0, 0.8, 0],
      scale: [0.5, 1, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

// Interactive glowing line component
const InteractiveGlowingLine = ({ 
  x1, y1, x2, delay, mouseX, mouseY, containerRef 
}: { 
  x1: string; y1: string; x2: string; delay: number;
  mouseX: number; mouseY: number; containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const lineRef = useRef<HTMLDivElement>(null);
  
  // Calculate proximity-based glow
  const getGlowIntensity = useCallback(() => {
    if (!lineRef.current || !containerRef.current) return 0.1;
    const lineRect = lineRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const lineCenterX = lineRect.left + lineRect.width / 2 - containerRect.left;
    const lineCenterY = lineRect.top + lineRect.height / 2 - containerRect.top;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - lineCenterX, 2) + Math.pow(mouseY - lineCenterY, 2)
    );
    
    const maxDistance = 150;
    const intensity = Math.max(0, 1 - distance / maxDistance);
    return 0.1 + intensity * 0.9;
  }, [mouseX, mouseY, containerRef]);

  const glowIntensity = getGlowIntensity();

  return (
    <motion.div
      ref={lineRef}
      className="absolute h-px transition-all duration-200"
      style={{
        left: x1,
        top: y1,
        width: `calc(${x2} - ${x1})`,
        transformOrigin: "left",
        background: `linear-gradient(90deg, transparent, hsl(var(--primary) / ${glowIntensity}), transparent)`,
        boxShadow: glowIntensity > 0.3 ? `0 0 ${glowIntensity * 20}px hsl(var(--primary) / ${glowIntensity * 0.5})` : 'none',
      }}
      animate={{
        scaleX: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Interactive circuit component
const InteractiveCircuit = ({ 
  position, path, circlePos, mouseX, mouseY, containerRef, delay = 0 
}: { 
  position: 'left' | 'right';
  path: string;
  circlePos: { cx: number; cy: number };
  mouseX: number;
  mouseY: number;
  containerRef: React.RefObject<HTMLDivElement>;
  delay?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const getGlowIntensity = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return 0.2;
    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const svgCenterX = svgRect.left + svgRect.width / 2 - containerRect.left;
    const svgCenterY = svgRect.top + svgRect.height / 2 - containerRect.top;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - svgCenterX, 2) + Math.pow(mouseY - svgCenterY, 2)
    );
    
    const maxDistance = 200;
    const intensity = Math.max(0, 1 - distance / maxDistance);
    return 0.2 + intensity * 0.8;
  }, [mouseX, mouseY, containerRef]);

  const glowIntensity = getGlowIntensity();
  const isActive = glowIntensity > 0.4;

  return (
    <svg 
      ref={svgRef}
      className={`absolute bottom-0 ${position === 'left' ? 'left-0' : 'right-0'} h-32 w-32 transition-opacity duration-300`}
      style={{ opacity: 0.2 + glowIntensity * 0.6 }}
      viewBox="0 0 100 100"
    >
      <defs>
        <filter id={`glow-${position}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isActive ? "3" : "1"} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={path}
        stroke="hsl(var(--primary))"
        strokeWidth={isActive ? "2" : "1"}
        fill="none"
        filter={`url(#glow-${position})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: [glowIntensity * 0.5, glowIntensity, glowIntensity * 0.5],
        }}
        transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx={circlePos.cx}
        cy={circlePos.cy}
        r={isActive ? 5 : 3}
        fill="hsl(var(--primary))"
        filter={`url(#glow-${position})`}
        animate={{ 
          opacity: [glowIntensity * 0.5, glowIntensity, glowIntensity * 0.5], 
          scale: isActive ? [1, 1.5, 1] : [0.8, 1.2, 0.8] 
        }}
        transition={{ duration: isActive ? 1 : 2, repeat: Infinity, delay: delay + 1 }}
      />
      {/* Additional glow ring when active */}
      {isActive && (
        <motion.circle
          cx={circlePos.cx}
          cy={circlePos.cy}
          r="8"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.5, 2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </svg>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const socialLinks = [
    { name: "GitHub", href: "#", icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" },
    { name: "LinkedIn", href: "#", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
    { name: "Twitter", href: "#", icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
  ];

  // Generate floating particles
  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.8,
      duration: 6 + Math.random() * 4,
      x: 5 + (i * 8) + Math.random() * 5,
      size: 2 + Math.random() * 3,
    })), []
  );

  return (
    <footer 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative border-t border-border/50 bg-card/50 overflow-hidden"
    >
      {/* Elegant animated background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Aurora gradient waves */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 100%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 100%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 50% 120%, hsl(var(--primary) / 0.08) 0%, transparent 60%)
            `,
          }}
          animate={{
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-10 right-1/4 h-60 w-60 rounded-full bg-primary/8 blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.08, 0.15, 0.08],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -top-10 right-0 h-48 w-48 rounded-full bg-primary/5 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 12,
            delay: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} {...particle} />
        ))}

        {/* Interactive glowing horizontal lines */}
        <InteractiveGlowingLine x1="5%" y1="30%" x2="35%" delay={0} mouseX={mousePos.x} mouseY={mousePos.y} containerRef={containerRef} />
        <InteractiveGlowingLine x1="65%" y1="25%" x2="95%" delay={2} mouseX={mousePos.x} mouseY={mousePos.y} containerRef={containerRef} />
        <InteractiveGlowingLine x1="20%" y1="70%" x2="45%" delay={1} mouseX={mousePos.x} mouseY={mousePos.y} containerRef={containerRef} />
        <InteractiveGlowingLine x1="55%" y1="75%" x2="85%" delay={3} mouseX={mousePos.x} mouseY={mousePos.y} containerRef={containerRef} />

        {/* Interactive circuit-like corner accents */}
        <InteractiveCircuit
          position="left"
          path="M0 100 L0 60 L20 60 L20 40 L40 40"
          circlePos={{ cx: 40, cy: 40 }}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          containerRef={containerRef}
        />
        <InteractiveCircuit
          position="right"
          path="M100 100 L100 50 L80 50 L80 30 L60 30"
          circlePos={{ cx: 60, cy: 30 }}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          containerRef={containerRef}
          delay={2}
        />

        {/* Mesh grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      <div className="container relative mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                <span className="font-display text-sm font-bold text-primary">D</span>
              </div>
              <span className="font-display text-sm tracking-wider text-foreground">
                DEV<span className="text-primary">_PORTFOLIO</span>
              </span>
            </div>
            <p className="mt-4 font-body text-sm text-muted-foreground">
              Building the future of technology,
              <br />
              one intelligent system at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-display text-xs tracking-wider text-foreground">
              QUICK LINKS
            </h4>
            <div className="flex flex-col gap-2">
              {["About", "Projects", "Certifications", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-display text-xs tracking-wider text-foreground">
              CONNECT
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:border-primary hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="font-body text-xs text-muted-foreground">
            © {currentYear} Developer Portfolio. All systems operational.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 font-body text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              System Status: Online
            </span>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
};

export default Footer;
