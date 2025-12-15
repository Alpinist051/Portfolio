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
    <section id="about" className="relative overflow-hidden py-32" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="font-body text-sm tracking-[0.3em] text-primary">ABOUT</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wider md:text-4xl">
            THE <span className="text-neon">DEVELOPER</span>
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Paper-style about card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Animated border wrapper */}
            <div className="glow-border rounded-lg p-[2px]">
              <div className="paper-texture relative overflow-hidden rounded-lg p-8 md:p-10">
                {/* Corner decorations */}
                <div className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-paper-border" />
                <div className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-paper-border" />
                <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-paper-border" />
                <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-paper-border" />

                <h3 className="mb-6 font-serif text-2xl font-semibold italic text-paper-text md:text-3xl">
                  Summary
                </h3>

                <div className="space-y-4 font-serif text-lg leading-relaxed text-paper-text/90">
                  <p>
                    Results-driven <strong>AI/ML Engineer</strong> and{" "}
                    <strong>Full Stack Developer</strong> with over 6 years of expertise in
                    building intelligent, end-to-end software systems.
                  </p>
                  <p>
                    I specialize in designing and deploying scalable web applications using modern
                    technologies including React, Node.js, and Python-based frameworks.
                  </p>
                  <p>
                    My core focus lies in developing and fine-tuning LLMs, building custom RAG
                    systems, and designing multi-agent workflows to automate processes and enhance
                    system intelligence.
                  </p>
                </div>

                {/* Paper fold effect */}
                <div className="absolute -right-2 -top-2 h-8 w-8 rotate-45 bg-gradient-to-br from-paper-dark to-paper" />
              </div>
            </div>

            {/* Shadow */}
            <div className="absolute -bottom-4 left-4 right-4 h-8 rounded-lg bg-primary/10 blur-xl" />
          </motion.div>

          {/* Skills grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {skills.map((skillGroup, i) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="card-hover group rounded-lg border border-border bg-card p-6"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
                }}
              >
                <h4 className="mb-3 font-display text-sm tracking-wider text-primary">
                  {skillGroup.category}
                </h4>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors group-hover:text-foreground"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

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
              <div className="font-display text-4xl font-bold text-neon md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 font-body text-sm tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
