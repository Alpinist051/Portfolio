import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("about");

  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Python", "FastAPI", "GraphQL"] },
    { category: "AI/ML", items: ["LLMs", "RAG Systems", "Fine-tuning", "Multi-Agent"] },
    { category: "Infrastructure", items: ["AWS", "Docker", "Kubernetes", "MLOps"] },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section id="about" className="relative overflow-hidden" ref={ref}>
      {/* Full width section */}
      <div className="relative min-h-screen bg-[#fafafa]">
        {/* Animated floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 200 + 100,
                height: Math.random() * 200 + 100,
                background: `radial-gradient(circle, rgba(139, 105, 20, ${0.05 + Math.random() * 0.05}) 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Moving grid lines */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full bg-gray-800"
              style={{ top: `${i * 10}%` }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Main content area - wider padding */}
        <div className="container relative z-10 mx-auto px-4 py-24">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            {/* Animated Icon */}
            <motion.div 
              className="mb-4 inline-flex items-center justify-center"
              variants={floatVariants}
              animate="animate"
            >
              <motion.svg 
                className="h-8 w-8 text-gray-600" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </motion.svg>
            </motion.div>
            <motion.div 
              className="mx-auto mb-2 h-8 w-px bg-gray-400"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            
            <div className="relative">
              <motion.span 
                className="absolute inset-0 font-display text-5xl font-bold tracking-wide text-gray-200 blur-[1px] md:text-6xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                ABOUT ME
              </motion.span>
              <motion.h2 
                className="relative font-display text-4xl font-bold tracking-wide text-gray-800 md:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                About me
              </motion.h2>
            </div>
            <motion.p 
              className="mt-4 font-body text-gray-500"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Experience, technologies and background.
            </motion.p>
          </motion.div>

          {/* Tabs navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 flex max-w-3xl items-center justify-center rounded-full bg-gray-100 p-1"
          >
            {["about", "skill", "education"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative rounded-full px-8 py-3 font-body text-sm font-medium transition-all ${
                  activeTab === tab ? "text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.toUpperCase()}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <div>
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12 text-center"
            >
              <motion.h3 
                className="mb-2 font-serif text-2xl font-bold text-gray-800"
                whileHover={{ scale: 1.02 }}
              >
                AI/ML Engineer & Full Stack Developer
              </motion.h3>
              <motion.p 
                className="font-serif text-sm italic text-gray-500"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                - AI, Machine Learning, Web, Mobile Application, Blockchain & Web3
              </motion.p>
              <motion.div 
                className="mx-auto mt-6 max-w-3xl font-serif leading-relaxed text-gray-600"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p>
                  Results-driven <strong className="text-gray-800">AI/ML Engineer</strong> and{" "}
                  <strong className="text-gray-800">Full Stack Developer</strong> with over 6 years of expertise in
                  building intelligent, end-to-end software systems. I specialize in designing and deploying 
                  scalable web applications using modern technologies including React, Node.js, and Python-based frameworks.
                </p>
              </motion.div>
            </motion.div>

            {/* Skills grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {skills.map((skillGroup, i) => (
                <motion.div
                  key={skillGroup.category}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    y: -5,
                  }}
                  className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all cursor-pointer"
                >
                  <motion.h4 
                    className="mb-3 font-display text-sm tracking-wider text-primary"
                    initial={{ x: -10, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  >
                    {skillGroup.category}
                  </motion.h4>
                  <ul className="space-y-2">
                    {skillGroup.items.map((skill, j) => (
                      <motion.li
                        key={skill}
                        className="flex items-center gap-2 font-body text-sm text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.6 + i * 0.1 + j * 0.05 }}
                        whileHover={{ x: 5, color: "#1a1a1a" }}
                      >
                        <motion.span 
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          whileHover={{ scale: 1.5 }}
                        />
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              {[
                { value: "6+", label: "Years Experience" },
                { value: "50+", label: "Projects Delivered" },
                { value: "20+", label: "AI Solutions" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="text-center group cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="font-display text-4xl font-bold text-primary md:text-5xl"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 10, 
                      delay: 0.8 + i * 0.1 
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <motion.div 
                    className="mt-2 font-body text-sm tracking-wider text-gray-500 group-hover:text-gray-800 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Subtle paper texture overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </section>
  );
};

export default AboutSection;
