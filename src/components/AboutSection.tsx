import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { GraduationCap, Code2, User, Sparkles, MapPin, Calendar, Award } from "lucide-react";

// CountUp hook
const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);
  
  return count;
};

const AboutSection = () => {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });
  const [activeTab, setActiveTab] = useState("about");

  // CountUp values
  const yearsCount = useCountUp(6, 2000, statsInView);
  const projectsCount = useCountUp(50, 2000, statsInView);
  const aiCount = useCountUp(20, 2000, statsInView);
  const satisfactionCount = useCountUp(100, 2000, statsInView);

  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Python", "FastAPI", "GraphQL"] },
    { category: "AI/ML", items: ["LLMs", "RAG Systems", "Fine-tuning", "Multi-Agent"] },
    { category: "Infrastructure", items: ["AWS", "Docker", "Kubernetes", "MLOps"] },
  ];

  const education = [
    {
      degree: "Master of Science in Computer Science",
      school: "National University of Singapore",
      period: "2018 - 2020",
      location: "Singapore",
      description: "Specialized in Artificial Intelligence and Machine Learning. Research focus on Natural Language Processing and Deep Learning architectures.",
      achievements: ["Dean's List", "Research Assistant", "Published 3 Papers"]
    },
    {
      degree: "Bachelor of Science in Computer Engineering",
      school: "National University of Singapore",
      period: "2014 - 2018",
      location: "Singapore",
      description: "Strong foundation in software engineering, algorithms, and computer systems. Minor in Mathematics.",
      achievements: ["First Class Honours", "Hackathon Winner", "Teaching Assistant"]
    }
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

  const tabIcons = {
    about: User,
    skill: Code2,
    education: GraduationCap,
  };

  const stats = [
    { value: yearsCount, suffix: "+", label: "Years Experience" },
    { value: projectsCount, suffix: "+", label: "Projects Delivered" },
    { value: aiCount, suffix: "+", label: "AI Solutions" },
    { value: satisfactionCount, suffix: "%", label: "Client Satisfaction" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Profile Summary */}
            <motion.div
              className="mb-10 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="mx-auto mb-6 relative w-28 h-28"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700 to-gray-500"
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(100, 100, 100, 0.2)",
                      "0 0 25px rgba(100, 100, 100, 0.3)",
                      "0 0 15px rgba(100, 100, 100, 0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-1 rounded-full bg-[#fafafa] flex items-center justify-center">
                  <User className="w-14 h-14 text-gray-700" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </motion.div>
              </motion.div>

              <motion.h3 
                className="mb-2 font-serif text-2xl font-bold text-gray-800"
                whileHover={{ scale: 1.02 }}
              >
                AI/ML Engineer & Full Stack Developer
              </motion.h3>
              <motion.p 
                className="font-serif text-sm italic text-gray-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                - AI, Machine Learning, Web, Mobile Application, Blockchain & Web3
              </motion.p>
              <motion.div 
                className="mx-auto mt-6 max-w-3xl font-serif text-lg leading-relaxed text-gray-600 md:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <p>
                  Results-driven <strong className="text-gray-800">AI/ML Engineer</strong> and{" "}
                  <strong className="text-gray-800">Full Stack Developer</strong> with over 6 years of expertise in
                  building intelligent, end-to-end software systems. I specialize in designing and deploying 
                  scalable web applications using modern technologies including React, Node.js, and Python-based frameworks.
                </p>
              </motion.div>
            </motion.div>

            {/* Profile highlights */}
            <motion.div
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: MapPin, label: "Location", value: "Singapore" },
                { icon: Calendar, label: "Experience", value: "6+ Years" },
                { icon: Award, label: "Specialization", value: "AI/ML & Full Stack" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    y: -3,
                  }}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all cursor-pointer relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <motion.div
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="h-5 w-5 text-gray-700" />
                    </motion.div>
                    <div>
                      <p className="text-base text-gray-500 font-body">{item.label}</p>
                      <p className="font-display text-xl font-semibold text-gray-800">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case "skill":
        return (
          <motion.div
            key="skill"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Skills grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {skills.map((skillGroup, i) => (
                <motion.div
                  key={skillGroup.category}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    y: -5,
                  }}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all cursor-pointer relative overflow-hidden"
                >
                  <motion.h4 
                    className="relative z-10 mb-3 font-display text-base tracking-wider text-gray-800 flex items-center gap-2"
                  >
                    <motion.span
                      className="inline-block w-1.5 h-5 bg-primary rounded-full"
                      animate={{ scaleY: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {skillGroup.category}
                  </motion.h4>
                  <ul className="relative z-10 space-y-2.5">
                    {skillGroup.items.map((skill, j) => (
                      <motion.li
                        key={skill}
                        className="flex items-center gap-2.5 font-body text-sm text-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.1 + j * 0.05 }}
                        whileHover={{ x: 8, color: "#1a1a1a" }}
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

            {/* Skill progress bars */}
            <motion.div
              className="mt-10 grid gap-5 sm:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { name: "React & Frontend", level: 95 },
                { name: "Node.js & Backend", level: 90 },
                { name: "AI/ML Development", level: 88 },
                { name: "Cloud & DevOps", level: 85 },
              ].map((skill, i) => (
                <motion.div
                  key={skill.name}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-body text-sm text-gray-700">{skill.name}</span>
                    <span className="font-display text-sm text-gray-800">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-gray-700 to-gray-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case "education":
        return (
          <motion.div
            key="education"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {education.map((edu, i) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ 
                  scale: 1.01, 
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                }}
                className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden cursor-pointer"
              >
                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 to-transparent"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                  {/* Icon */}
                  <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GraduationCap className="h-7 w-7 text-gray-700" />
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <motion.h4 
                        className="font-display text-lg font-bold text-gray-800"
                      >
                        {edu.degree}
                      </motion.h4>
                    </div>
                    
                    <motion.p 
                      className="font-serif text-base text-primary mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {edu.school}
                    </motion.p>

                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                    </div>

                    <p className="font-body text-sm text-gray-600 mb-3 leading-relaxed">
                      {edu.description}
                    </p>

                    {/* Achievements */}
                    <div className="flex flex-wrap gap-2">
                      {edu.achievements.map((achievement, j) => (
                        <motion.span
                          key={achievement}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + j * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-body text-gray-700"
                        >
                          <Award className="w-3 h-3" />
                          {achievement}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="about" className="relative overflow-hidden" ref={ref}>
      {/* Full width section */}
      <div className="relative bg-[#fafafa]">
        {/* Animated floating orbs - more subtle */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 150 + 80,
                height: Math.random() * 150 + 80,
                background: `radial-gradient(circle, rgba(150, 150, 150, ${0.03 + Math.random() * 0.04}) 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 60 - 30, 0],
                y: [0, Math.random() * 60 - 30, 0],
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

        {/* Animated grid pattern - more subtle */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.02]">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute h-px w-full bg-gray-600"
              style={{ top: `${i * 10}%` }}
              animate={{ 
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Main content area */}
        <div className="container relative z-10 mx-auto px-4 py-24">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            {/* Animated Icon */}
            <motion.div 
              className="mb-4 inline-flex items-center justify-center"
              variants={floatVariants}
              animate="animate"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.2 }}
              >
                <User className="h-8 w-8 text-gray-700" />
              </motion.div>
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
            className="mx-auto mb-10 flex max-w-2xl items-center justify-center rounded-full bg-gray-100 p-1 border border-gray-200"
          >
            {(["about", "skill", "education"] as const).map((tab) => {
              const Icon = tabIcons[tab];
              return (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium transition-all ${
                    activeTab === tab ? "text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {activeTab === tab && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gray-800"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{tab.toUpperCase()}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Fixed height content container */}
          <div className="min-h-[520px]">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>

          {/* Stats with CountUp */}
          <motion.div
            ref={statsRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center group cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.08 }}
              >
                <motion.div 
                  className="font-display text-4xl font-bold text-primary md:text-5xl"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 10, 
                    delay: 0.3 + i * 0.1 
                  }}
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                <motion.div 
                  className="mt-2 font-body text-sm tracking-wider text-gray-500 group-hover:text-gray-800 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Subtle paper texture overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </section>
  );
};

export default AboutSection;
