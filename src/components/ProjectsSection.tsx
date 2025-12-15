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
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Neural RAG Engine",
    category: "AI/ML",
    description: "Custom retrieval-augmented generation system for enterprise knowledge bases with multi-source indexing.",
    tech: ["Python", "LangChain", "Vector DB", "FastAPI"],
    gradient: "from-primary via-primary/50 to-accent",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Multi-Agent Orchestrator",
    category: "AI/ML",
    description: "Autonomous agent coordination platform for complex workflow automation with real-time monitoring.",
    tech: ["CrewAI", "OpenAI", "React", "WebSocket"],
    gradient: "from-secondary via-secondary/50 to-accent",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    title: "LLM Fine-tuning Pipeline",
    category: "MLOps",
    description: "End-to-end infrastructure for training and deploying custom language models at scale.",
    tech: ["PyTorch", "AWS SageMaker", "Docker", "MLflow"],
    gradient: "from-accent via-accent/50 to-primary",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
  },
  {
    id: 4,
    title: "Real-time Analytics Platform",
    category: "Full Stack",
    description: "High-performance dashboard for processing millions of events with sub-second latency.",
    tech: ["React", "Node.js", "Kafka", "TimescaleDB"],
    gradient: "from-primary via-accent/50 to-secondary",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
  },
  {
    id: 5,
    title: "AI Content Generator",
    category: "AI/ML",
    description: "Multi-modal content creation system with text, image, and video generation capabilities.",
    tech: ["GPT-4", "DALL-E", "Next.js", "Prisma"],
    gradient: "from-secondary via-primary/50 to-accent",
    image: "https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?w=400&h=200&fit=crop",
  },
  {
    id: 6,
    title: "Cloud Infrastructure Automation",
    category: "DevOps",
    description: "IaC solution automating entire cloud deployments with AI-driven optimization.",
    tech: ["Terraform", "Kubernetes", "AWS", "Python"],
    gradient: "from-accent via-secondary/50 to-primary",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
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
      className="group relative h-full"
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
        className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card"
      >
        {/* Thumbnail Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60`} />
          
          {/* Category badge - positioned over image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute left-4 top-4 inline-block rounded-full border border-primary/30 bg-card/80 backdrop-blur-sm px-3 py-1"
          >
            <span className="font-display text-xs tracking-wider text-primary">
              {project.category}
            </span>
          </motion.div>
        </div>

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
        <div className="relative z-10 flex flex-1 flex-col p-6">
          {/* Title with underline animation */}
          <h3 className="relative mb-3 inline-block font-display text-xl font-bold tracking-wide text-foreground">
            {project.title}
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </h3>

          <p className="mb-6 flex-1 font-body text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {/* Tech stack and arrow */}
          <div className="flex items-end justify-between gap-4">
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background"
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
          className="mb-16 flex flex-col items-center text-center"
        >
          {/* Icon */}
          <div className="mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-foreground"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          
          {/* Vertical line */}
          <div className="mb-4 h-8 w-px bg-foreground/60" />
          
          {/* Title with watermark effect */}
          <div className="relative">
            {/* Watermark text behind */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-5xl font-bold uppercase tracking-widest text-muted/30 md:text-7xl">
              PROJECTS
            </span>
            {/* Main title */}
            <h2 className="relative z-10 font-display text-3xl font-bold tracking-wider text-foreground md:text-4xl">
              Projects
            </h2>
          </div>
          
          <p className="mx-auto mt-6 max-w-2xl font-body text-muted-foreground">
            A curated selection of AI/ML solutions and full-stack applications.
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
