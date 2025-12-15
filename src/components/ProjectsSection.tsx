import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  gradient: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Neural RAG Engine",
    category: "AI/ML",
    description: "Custom retrieval-augmented generation system for enterprise knowledge bases with multi-source indexing.",
    tech: ["Python", "LangChain", "Vector DB", "FastAPI"],
    gradient: "from-primary via-primary/50 to-accent",
  },
  {
    id: 2,
    title: "Multi-Agent Orchestrator",
    category: "AI/ML",
    description: "Autonomous agent coordination platform for complex workflow automation with real-time monitoring.",
    tech: ["CrewAI", "OpenAI", "React", "WebSocket"],
    gradient: "from-secondary via-secondary/50 to-accent",
  },
  {
    id: 3,
    title: "LLM Fine-tuning Pipeline",
    category: "MLOps",
    description: "End-to-end infrastructure for training and deploying custom language models at scale.",
    tech: ["PyTorch", "AWS SageMaker", "Docker", "MLflow"],
    gradient: "from-accent via-accent/50 to-primary",
  },
  {
    id: 4,
    title: "Real-time Analytics Platform",
    category: "Full Stack",
    description: "High-performance dashboard for processing millions of events with sub-second latency.",
    tech: ["React", "Node.js", "Kafka", "TimescaleDB"],
    gradient: "from-primary via-accent/50 to-secondary",
  },
  {
    id: 5,
    title: "AI Content Generator",
    category: "AI/ML",
    description: "Multi-modal content creation system with text, image, and video generation capabilities.",
    tech: ["GPT-4", "DALL-E", "Next.js", "Prisma"],
    gradient: "from-secondary via-primary/50 to-accent",
  },
  {
    id: 6,
    title: "Cloud Infrastructure Automation",
    category: "DevOps",
    description: "IaC solution automating entire cloud deployments with AI-driven optimization.",
    tech: ["Terraform", "Kubernetes", "AWS", "Python"],
    gradient: "from-accent via-secondary/50 to-primary",
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Magnetic effect container */}
      <motion.div
        animate={{
          x: isHovered ? (mousePosition.x - 0.5) * 10 : 0,
          y: isHovered ? (mousePosition.y - 0.5) * 10 : 0,
          rotateX: isHovered ? (mousePosition.y - 0.5) * 5 : 0,
          rotateY: isHovered ? (mousePosition.x - 0.5) * -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-xl border border-border bg-card"
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
        />

        {/* Spotlight effect */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: isHovered
              ? `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(185 100% 50% / 0.1), transparent 40%)`
              : "none",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">
          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1"
          >
            <span className="font-display text-xs tracking-wider text-primary">
              {project.category}
            </span>
          </motion.div>

          {/* Title with underline animation */}
          <h3 className="relative mb-3 inline-block font-display text-xl font-bold tracking-wide text-foreground md:text-2xl">
            {project.title}
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </h3>

          <p className="mb-6 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-md bg-muted px-2 py-1 font-body text-xs text-muted-foreground transition-colors group-hover:bg-primary/20 group-hover:text-primary"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Arrow indicator */}
          <motion.div
            className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background"
            animate={{
              scale: isHovered ? 1.1 : 1,
              borderColor: isHovered ? "hsl(185 100% 50%)" : "hsl(var(--border))",
            }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground transition-colors group-hover:text-primary"
              animate={{ x: isHovered ? 2 : 0, y: isHovered ? -2 : 0 }}
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </motion.svg>
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${project.gradient}`}
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative py-32" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 space-grid opacity-30" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="font-body text-sm tracking-[0.3em] text-secondary">PORTFOLIO</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wider md:text-4xl">
            FEATURED <span className="text-neon-magenta">PROJECTS</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground">
            A curated selection of AI/ML solutions and full-stack applications
            that showcase innovation and technical excellence.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View more button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            to="/projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-secondary/50 bg-secondary/10 px-8 py-4 font-display text-sm font-semibold tracking-wider text-secondary transition-all hover:border-secondary hover:shadow-magenta"
          >
            <span className="relative z-10">EXPLORE ALL PROJECTS</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </motion.svg>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-secondary/20 to-transparent transition-transform group-hover:translate-x-full" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
