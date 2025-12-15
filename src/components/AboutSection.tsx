import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Python", "FastAPI", "GraphQL"] },
    { category: "AI/ML", items: ["LLMs", "RAG Systems", "Fine-tuning", "Multi-Agent"] },
    { category: "Infrastructure", items: ["AWS", "Docker", "Kubernetes", "MLOps"] },
  ];

  return (
    <section id="about" className="relative overflow-hidden" ref={ref}>
      {/* Book page with curl effect */}
      <div className="relative min-h-screen bg-[#fafafa]">
        {/* Page curl effect - left side */}
        <div className="absolute left-0 top-0 h-full w-24 md:w-40 lg:w-56 overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #d4a853 0%, #b8942d 30%, #8b6914 60%, #6b4f0f 100%)',
              clipPath: 'polygon(0 0, 100% 0, 30% 100%, 0 100%)',
            }}
          />
          {/* Shadow under the curl */}
          <div 
            className="absolute right-0 top-0 h-full w-16"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)',
            }}
          />
        </div>

        {/* Main content area */}
        <div className="relative z-10 px-8 py-24 md:px-16 lg:px-32">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            {/* Icon */}
            <div className="mb-4 inline-flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="mx-auto mb-2 h-8 w-px bg-gray-400" />
            
            <h2 className="relative font-display text-4xl font-bold tracking-wide text-gray-800 md:text-5xl">
              <span className="absolute inset-0 text-gray-200 blur-[1px]" style={{ fontSize: '120%', top: '-10%' }}>
                ABOUT ME
              </span>
              <span className="relative">About me</span>
            </h2>
            <p className="mt-4 font-body text-gray-500">
              Experience, technologies and background.
            </p>
          </motion.div>

          {/* Tabs navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 flex max-w-3xl items-center justify-center rounded-full bg-gray-100 p-1"
          >
            <button className="rounded-full bg-primary px-8 py-3 font-body text-sm font-medium text-white transition-all">
              ABOUT
            </button>
            <button className="px-8 py-3 font-body text-sm font-medium text-gray-600 transition-all hover:text-gray-900">
              SKILL
            </button>
            <button className="px-8 py-3 font-body text-sm font-medium text-gray-600 transition-all hover:text-gray-900">
              EDUCATION
            </button>
          </motion.div>

          {/* Content */}
          <div className="mx-auto max-w-4xl">
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12 text-center"
            >
              <h3 className="mb-2 font-serif text-2xl font-bold text-gray-800">
                AI/ML Engineer & Full Stack Developer
              </h3>
              <p className="font-serif text-sm italic text-gray-500">
                - AI, Machine Learning, Web, Mobile Application, Blockchain & Web3
              </p>
              <div className="mx-auto mt-6 max-w-3xl font-serif leading-relaxed text-gray-600">
                <p>
                  Results-driven <strong className="text-gray-800">AI/ML Engineer</strong> and{" "}
                  <strong className="text-gray-800">Full Stack Developer</strong> with over 6 years of expertise in
                  building intelligent, end-to-end software systems. I specialize in designing and deploying 
                  scalable web applications using modern technologies including React, Node.js, and Python-based frameworks.
                </p>
              </div>
            </motion.div>

            {/* Skills grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {skills.map((skillGroup, i) => (
                <motion.div
                  key={skillGroup.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h4 className="mb-3 font-display text-sm tracking-wider text-primary">
                    {skillGroup.category}
                  </h4>
                  <ul className="space-y-2">
                    {skillGroup.items.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-2 font-body text-sm text-gray-600"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              {[
                { value: "6+", label: "Years Experience" },
                { value: "50+", label: "Projects Delivered" },
                { value: "20+", label: "AI Solutions" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-display text-4xl font-bold text-primary md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-body text-sm tracking-wider text-gray-500">
                    {stat.label}
                  </div>
                </div>
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
