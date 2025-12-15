import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    if (item.isPage) {
      // Navigate to the page
      window.location.href = item.href;
    } else if (location.pathname !== "/") {
      // If on another page and clicking anchor, go to home + anchor
      window.location.href = "/" + item.href;
    } else {
      // On home page, scroll to section
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
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
        <Link to="/" className="group flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
            <span className="font-display text-lg font-bold text-primary">D</span>
            <motion.div
              className="absolute inset-0 rounded-lg border border-primary"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="hidden font-display text-sm tracking-wider text-foreground sm:block">
            DEV<span className="text-primary">_PORTFOLIO</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
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
          ))}
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
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item)}
              className="py-3 text-left font-display text-sm tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
