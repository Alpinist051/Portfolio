import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { GraduationCap, Code2, User, Sparkles, MapPin, Calendar, Award } from "lucide-react";

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

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(0, 180, 216, 0.2)",
        "0 0 40px rgba(0, 180, 216, 0.4)",
        "0 0 20px rgba(0, 180, 216, 0.2)",
      ],
      transition: {
        duration: 2,
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Summary */}
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="mx-auto mb-6 relative w-32 h-32"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-cyan-400"
                  variants={glowVariants}
                  animate="animate"
                />
                <div className="absolute inset-1 rounded-full bg-[#fafafa] flex items-center justify-center">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-primary" />
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
                className="mx-auto mt-6 max-w-3xl font-serif leading-relaxed text-gray-600"
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
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: MapPin, label: "Location", value: "Singapore" },
                { icon: Calendar, label: "Experience", value: "6+ Years" },
                { icon: Award, label: "Specialization", value: "AI/ML & Full Stack" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(0,180,216,0.15)",
                    y: -5,
                  }}
                  className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all cursor-pointer relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-gray-500 font-body">{item.label}</p>
                      <p className="font-display text-lg font-semibold text-gray-800">{item.value}</p>
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
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Skills grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {skills.map((skillGroup, i) => (
                <motion.div
                  key={skillGroup.category}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(0,180,216,0.15)",
                    y: -8,
                  }}
                  className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Floating particles */}
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary/30"
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />

                  <motion.h4 
                    className="relative z-10 mb-4 font-display text-lg tracking-wider text-primary flex items-center gap-2"
                  >
                    <motion.span
                      className="inline-block w-2 h-6 bg-primary rounded-full"
                      animate={{ scaleY: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {skillGroup.category}
                  </motion.h4>
                  <ul className="relative z-10 space-y-3">
                    {skillGroup.items.map((skill, j) => (
                      <motion.li
                        key={skill}
                        className="flex items-center gap-3 font-body text-sm text-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.1 + j * 0.05 }}
                        whileHover={{ x: 10, color: "#1a1a1a" }}
                      >
                        <motion.span 
                          className="h-2 w-2 rounded-full bg-primary"
                          whileHover={{ scale: 2 }}
                          animate={{ 
                            boxShadow: ["0 0 0 0 rgba(0,180,216,0.4)", "0 0 0 6px rgba(0,180,216,0)", "0 0 0 0 rgba(0,180,216,0.4)"]
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
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
              className="mt-12 grid gap-6 sm:grid-cols-2"
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
                    <span className="font-display text-sm text-primary">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
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
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {education.map((edu, i) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 25px 50px rgba(0,180,216,0.15)",
                }}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm overflow-hidden cursor-pointer"
              >
                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Timeline dot */}
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary hidden lg:block"
                  animate={{ 
                    boxShadow: ["0 0 0 0 rgba(0,180,216,0.4)", "0 0 0 12px rgba(0,180,216,0)", "0 0 0 0 rgba(0,180,216,0.4)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Icon */}
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <motion.h4 
                        className="font-display text-xl font-bold text-gray-800"
                        whileHover={{ color: "#00b4d8" }}
                      >
                        {edu.degree}
                      </motion.h4>
                    </div>
                    
                    <motion.p 
                      className="font-serif text-lg text-primary mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {edu.school}
                    </motion.p>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                    </div>

                    <p className="font-body text-gray-600 mb-4 leading-relaxed">
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
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(0,180,216,0.2)" }}
                          className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-body text-primary"
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
      <div className="relative min-h-screen bg-[#fafafa]">
        {/* Animated floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 200 + 100,
                height: Math.random() * 200 + 100,
                background: `radial-gradient(circle, rgba(0, 180, 216, ${0.05 + Math.random() * 0.08}) 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute h-px w-full bg-primary"
              style={{ top: `${i * 7}%` }}
              animate={{ 
                x: ["-100%", "100%"],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 15 + i * 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute w-px h-full bg-primary"
              style={{ left: `${i * 7}%` }}
              animate={{ 
                y: ["-100%", "100%"],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 20 + i * 1.5,
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
            className="mb-16 text-center"
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
                <User className="h-8 w-8 text-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ 
                    boxShadow: ["0 0 0 0 rgba(0,180,216,0.4)", "0 0 0 15px rgba(0,180,216,0)", "0 0 0 0 rgba(0,180,216,0.4)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="mx-auto mb-2 h-8 w-px bg-primary/50"
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
            className="mx-auto mb-12 flex max-w-3xl items-center justify-center rounded-full bg-gray-100/80 backdrop-blur-sm p-1.5 border border-gray-200"
          >
            {(["about", "skill", "education"] as const).map((tab) => {
              const Icon = tabIcons[tab];
              return (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium transition-all ${
                    activeTab === tab ? "text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeTab === tab && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-cyan-500"
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

          {/* Content with AnimatePresence */}
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>

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
                  className="font-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 md:text-5xl"
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
                  className="mt-2 font-body text-sm tracking-wider text-gray-500 group-hover:text-primary transition-colors"
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
