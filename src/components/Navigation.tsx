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
    { href: "/insights", label: "INSIGHTS", isPage: true },
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
          {navItems.map((item) =>
            item.isPage ? (
              <Link
                key={item.href}
                to={item.href}
                className="group relative px-4 py-2 font-display text-xs tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
                <motion.span
                  className="absolute bottom-1 left-4 right-4 h-px bg-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ) : (
              <button
                key={item.href}
                onClick={() => handleNavClick(item)}
                className="group relative px-4 py-2 font-display text-xs tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
                <motion.span
                  className="absolute bottom-1 left-4 right-4 h-px bg-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            )
          )}
        </div>

        {/* Status indicator */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="font-body text-xs text-muted-foreground">Available</span>
        </div>

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
