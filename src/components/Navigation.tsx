import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#about", label: "ABOUT", isPage: false },
    { href: "/projects", label: "PROJECTS", isPage: true },
    { href: "#certifications", label: "CERTS", isPage: false },
    { href: "#contact", label: "CONTACT", isPage: false },
    { href: "/platform", label: "PLATFORM", isPage: true },
  ];

  const handleNavClick = (item: { href: string; label: string; isPage: boolean }) => {
    setIsMobileMenuOpen(false);
    
    if (item.isPage) {
      // Navigate to the page using React Router
      navigate(item.href);
    } else if (location.pathname !== "/") {
      // If on another page and clicking anchor, go to home first then scroll
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // On home page, scroll to section
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <motion.div 
            className="relative flex h-11 w-11 items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-[-8px] rounded-2xl bg-primary/0 blur-xl"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)' }}
            />
            <div className="absolute inset-[-8px] rounded-2xl bg-primary/0 blur-xl transition-all duration-300 group-hover:bg-primary/30" />
            
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-xl border border-primary/40 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner glowing box */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm transition-all duration-300 group-hover:from-primary/40 group-hover:to-primary/20 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              <span className="font-display text-xl font-bold bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]">
                IT
              </span>
              {/* Pulse effect - faster on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary/20 transition-all duration-300 group-hover:bg-primary/30"
                animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            {/* Corner accents - glow on hover */}
            <div className="absolute -top-0.5 -left-0.5 h-2 w-2 border-t border-l border-primary/60 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_6px_hsl(var(--primary)/0.8)]" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 border-t border-r border-primary/60 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_6px_hsl(var(--primary)/0.8)]" />
            <div className="absolute -bottom-0.5 -left-0.5 h-2 w-2 border-b border-l border-primary/60 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_6px_hsl(var(--primary)/0.8)]" />
            <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 border-b border-r border-primary/60 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_6px_hsl(var(--primary)/0.8)]" />
          </motion.div>
          
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-base tracking-widest text-foreground transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]">
              IVAN<span className="text-primary"> TAN</span>
            </span>
            <span className="font-body text-[10px] tracking-wider text-muted-foreground/70 transition-all duration-300 group-hover:text-muted-foreground">
              DEVELOPER & CREATOR
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item, index) =>
            item.isPage ? (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className="group relative flex items-center px-4 py-2"
                >
                  {/* Background glow on hover */}
                  <span className="absolute inset-0 rounded-lg bg-primary/0 transition-all duration-300 group-hover:bg-primary/10 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]" />
                  {/* Left accent line */}
                  <span className="absolute left-1 top-1/2 h-0 w-px -translate-y-1/2 bg-primary transition-all duration-300 group-hover:h-4" />
                  {/* Text */}
                  <span className="relative font-display text-xs tracking-wider text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]">
                    {item.label}
                  </span>
                  {/* Bottom line animation */}
                  <motion.span
                    className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Corner dots on hover */}
                  <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary/60" />
                  <span className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary/60" />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <button
                  onClick={() => handleNavClick(item)}
                  className="group relative flex items-center px-4 py-2"
                >
                  {/* Background glow on hover */}
                  <span className="absolute inset-0 rounded-lg bg-primary/0 transition-all duration-300 group-hover:bg-primary/10 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]" />
                  {/* Left accent line */}
                  <span className="absolute left-1 top-1/2 h-0 w-px -translate-y-1/2 bg-primary transition-all duration-300 group-hover:h-4" />
                  {/* Text */}
                  <span className="relative font-display text-xs tracking-wider text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]">
                    {item.label}
                  </span>
                  {/* Bottom line animation */}
                  <motion.span
                    className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Corner dots on hover */}
                  <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary/60" />
                  <span className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary/60" />
                </button>
              </motion.div>
            )
          )}
        </div>

        {/* Status indicator */}
        <motion.div 
          className="group hidden items-center gap-3 rounded-full border border-border/50 bg-background/50 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/5 md:flex"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated status dot */}
          <div className="relative flex h-3 w-3 items-center justify-center">
            {/* Outer pulse rings */}
            <motion.span 
              className="absolute h-full w-full rounded-full bg-green-400/30"
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span 
              className="absolute h-full w-full rounded-full bg-green-400/20"
              animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
            {/* Inner glow */}
            <span className="absolute h-2 w-2 rounded-full bg-green-400/50 blur-sm" />
            {/* Core dot */}
            <motion.span 
              className="relative h-2 w-2 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-[0_0_8px_rgba(74,222,128,0.6)]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          {/* Status text */}
          <div className="flex flex-col">
            <span className="font-display text-[10px] tracking-wider text-green-400/80 transition-all duration-300 group-hover:text-green-400">
              AVAILABLE
            </span>
            <span className="font-body text-[8px] text-muted-foreground/50">
              For new projects
            </span>
          </div>
        </motion.div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <motion.span
            animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 bg-foreground"
          />
          <motion.span
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="h-0.5 w-6 bg-foreground"
          />
          <motion.span
            animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 bg-foreground"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="overflow-hidden bg-background/95 backdrop-blur-lg md:hidden"
      >
        <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
          {navItems.map((item) =>
            item.isPage ? (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-left font-display text-sm tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.href}
                onClick={() => handleNavClick(item)}
                className="py-3 text-left font-display text-sm tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </button>
            )
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
