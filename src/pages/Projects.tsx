import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  gradient: string;
  featured?: boolean;
}

const allProjects: Project[] = [
  {
    id: 1,
    title: "Neural RAG Engine",
    category: "AI/ML",
    description: "Custom retrieval-augmented generation system for enterprise knowledge bases with multi-source indexing and semantic search.",
    tech: ["Python", "LangChain", "Vector DB", "FastAPI"],
    gradient: "from-primary via-primary/50 to-accent",
    featured: true,
  },
  {
    id: 2,
    title: "Multi-Agent Orchestrator",
    category: "AI/ML",
    description: "Autonomous agent coordination platform for complex workflow automation with real-time monitoring and self-healing capabilities.",
    tech: ["CrewAI", "OpenAI", "React", "WebSocket"],
    gradient: "from-secondary via-secondary/50 to-accent",
    featured: true,
  },
  {
    id: 3,
    title: "LLM Fine-tuning Pipeline",
    category: "MLOps",
    description: "End-to-end infrastructure for training and deploying custom language models at scale with version control and A/B testing.",
    tech: ["PyTorch", "AWS SageMaker", "Docker", "MLflow"],
    gradient: "from-accent via-accent/50 to-primary",
    featured: true,
  },
  {
    id: 4,
    title: "Real-time Analytics Platform",
    category: "Full Stack",
    description: "High-performance dashboard for processing millions of events with sub-second latency and interactive visualizations.",
    tech: ["React", "Node.js", "Kafka", "TimescaleDB"],
    gradient: "from-primary via-accent/50 to-secondary",
  },
  {
    id: 5,
    title: "AI Content Generator",
    category: "AI/ML",
    description: "Multi-modal content creation system with text, image, and video generation capabilities for marketing teams.",
    tech: ["GPT-4", "DALL-E", "Next.js", "Prisma"],
    gradient: "from-secondary via-primary/50 to-accent",
  },
  {
    id: 6,
    title: "Cloud Infrastructure Automation",
    category: "DevOps",
    description: "IaC solution automating entire cloud deployments with AI-driven cost optimization and security compliance.",
    tech: ["Terraform", "Kubernetes", "AWS", "Python"],
    gradient: "from-accent via-secondary/50 to-primary",
  },
  {
    id: 7,
    title: "Conversational AI Platform",
    category: "AI/ML",
    description: "Enterprise chatbot framework with multi-language support, sentiment analysis, and CRM integration.",
    tech: ["Rasa", "Python", "PostgreSQL", "Redis"],
    gradient: "from-primary via-secondary/50 to-accent",
  },
  {
    id: 8,
    title: "Document Intelligence System",
    category: "AI/ML",
    description: "Automated document processing with OCR, entity extraction, and intelligent classification for legal documents.",
    tech: ["Tesseract", "spaCy", "FastAPI", "MongoDB"],
    gradient: "from-secondary via-accent/50 to-primary",
  },
  {
    id: 9,
    title: "Predictive Maintenance IoT",
    category: "AI/ML",
    description: "Machine learning system for predicting equipment failures using sensor data and reducing downtime by 40%.",
    tech: ["TensorFlow", "Apache Spark", "InfluxDB", "Grafana"],
    gradient: "from-accent via-primary/50 to-secondary",
  },
  {
    id: 10,
    title: "E-commerce Recommendation Engine",
    category: "AI/ML",
    description: "Personalized product recommendation system increasing conversion rates through collaborative filtering and deep learning.",
    tech: ["PyTorch", "Redis", "FastAPI", "PostgreSQL"],
    gradient: "from-primary via-accent/50 to-secondary",
  },
  {
    id: 11,
    title: "Microservices Architecture",
    category: "Full Stack",
    description: "Complete migration of monolithic application to microservices with service mesh and observability stack.",
    tech: ["Go", "gRPC", "Istio", "Prometheus"],
    gradient: "from-secondary via-primary/50 to-accent",
  },
  {
    id: 12,
    title: "Computer Vision Quality Control",
    category: "AI/ML",
    description: "Real-time defect detection system for manufacturing with 99.5% accuracy using custom trained models.",
    tech: ["YOLO", "OpenCV", "TensorRT", "C++"],
    gradient: "from-accent via-secondary/50 to-primary",
  },
];

const categories = ["All", "AI/ML", "Full Stack", "MLOps", "DevOps"];

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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        animate={{
          x: isHovered ? (mousePosition.x - 0.5) * 8 : 0,
          y: isHovered ? (mousePosition.y - 0.5) * 8 : 0,
          rotateX: isHovered ? (mousePosition.y - 0.5) * 3 : 0,
          rotateY: isHovered ? (mousePosition.x - 0.5) * -3 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-xl border border-border bg-card"
      >
        {project.featured && (
          <div className="absolute right-4 top-4 z-20 rounded-full bg-primary/20 px-2 py-1">
            <span className="font-display text-[10px] tracking-wider text-primary">FEATURED</span>
          </div>
        )}

        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
        />

        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: isHovered
              ? `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(185 100% 50% / 0.08), transparent 40%)`
              : "none",
          }}
        />

        <div className="relative z-10 p-6">
          <div className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
            <span className="font-display text-xs tracking-wider text-primary">
              {project.category}
            </span>
          </div>

          <h3 className="relative mb-3 inline-block font-display text-lg font-bold tracking-wide text-foreground">
            {project.title}
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </h3>

          <p className="mb-6 font-body text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <span
                key={tech}
                className="rounded-md bg-muted px-2 py-1 font-body text-xs text-muted-foreground transition-colors group-hover:bg-primary/20 group-hover:text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

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

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? allProjects
    : allProjects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pb-20 pt-32">
        <div className="absolute inset-0 space-grid opacity-20" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Home
            </Link>
            <h1 className="font-display text-4xl font-bold tracking-wider md:text-5xl">
              ALL <span className="text-neon">PROJECTS</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground">
              A comprehensive collection of AI/ML solutions, full-stack applications, and DevOps 
              implementations that demonstrate technical excellence and innovation.
            </p>
          </motion.div>

          {/* Category filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 flex flex-wrap justify-center gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-4 py-2 font-display text-xs tracking-wider transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-neon"
                    : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProjectsPage;
