import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Lightbulb, Code, Rocket, Brain, Server, Shield, Users, Cloud, FileText, Zap } from "lucide-react";

interface Insight {
  id: number;
  quote: string;
  category: string;
  expanded?: string;
  icon: React.ElementType;
  size?: "normal" | "large" | "wide";
}

const allInsights: Insight[] = [
  {
    id: 1,
    quote: "AI is not about replacing humans—it's about amplifying human potential and automating the mundane.",
    category: "AI Strategy",
    expanded: "The most successful AI implementations I've built focus on augmenting human decision-making rather than removing humans from the loop.",
    icon: Brain,
    size: "large",
  },
  {
    id: 2,
    quote: "The best code is the code that doesn't exist. Simplicity should always be your first instinct.",
    category: "Development Philosophy",
    expanded: "Every line of code is a liability—it needs to be maintained, tested, and understood by future developers.",
    icon: Code,
    size: "normal",
  },
  {
    id: 3,
    quote: "Start with a working prototype before perfecting. Your users' feedback is worth more than your assumptions.",
    category: "Product Development",
    expanded: "Ship early, gather feedback, iterate. The first version should answer one question: does anyone actually want this?",
    icon: Rocket,
    size: "normal",
  },
  {
    id: 4,
    quote: "Invest in your data infrastructure early. AI solutions are only as good as the data they learn from.",
    category: "AI/ML Best Practices",
    expanded: "Garbage in, garbage out. Before building any ML model, ensure you have clean, well-structured data pipelines.",
    icon: Brain,
    size: "wide",
  },
  {
    id: 5,
    quote: "Microservices aren't always the answer. Start with a well-structured monolith unless you have a clear reason not to.",
    category: "Architecture",
    expanded: "The overhead of distributed systems is significant. A modular monolith is often the more pragmatic choice.",
    icon: Server,
    size: "normal",
  },
  {
    id: 6,
    quote: "Technical debt is like financial debt—sometimes it's strategic, but always pay attention to the interest.",
    category: "Engineering Leadership",
    expanded: "Keep a technical debt register, estimate the 'interest' cost in maintenance time, and allocate regular time to pay it down.",
    icon: Zap,
    size: "normal",
  },
  {
    id: 7,
    quote: "The most expensive software projects are those that solve the wrong problem perfectly.",
    category: "Product Development",
    expanded: "Building the right thing is more important than building the thing right.",
    icon: Lightbulb,
    size: "large",
  },
  {
    id: 8,
    quote: "Cloud costs are the new infrastructure—monitor them like you would server uptime.",
    category: "DevOps",
    expanded: "Set up cost alerts, review spending weekly, and treat cloud resources as finite.",
    icon: Cloud,
    size: "normal",
  },
  {
    id: 9,
    quote: "Documentation is not optional. Your future self and your team will thank you.",
    category: "Best Practices",
    expanded: "Write docs as you build, not after. Include the 'why' behind decisions, not just the 'how'.",
    icon: FileText,
    size: "normal",
  },
  {
    id: 10,
    quote: "Security is not a feature—it's a foundation. Build it in from day one, not as an afterthought.",
    category: "Security",
    expanded: "The cost of a breach far exceeds the cost of prevention.",
    icon: Shield,
    size: "wide",
  },
  {
    id: 11,
    quote: "The best teams I've worked with ship small changes frequently rather than big releases rarely.",
    category: "Engineering Culture",
    expanded: "Small, incremental deployments reduce risk, speed up feedback loops, and keep teams motivated.",
    icon: Users,
    size: "normal",
  },
  {
    id: 12,
    quote: "AI can help you code faster, but it can't help you think better. Invest in understanding fundamentals.",
    category: "AI Strategy",
    expanded: "Understanding algorithms, system design, and CS fundamentals will make you a better developer and AI user.",
    icon: Brain,
    size: "normal",
  },
  {
    id: 13,
    quote: "Mobile-first design isn't just about screens—it's about constraints that force better solutions.",
    category: "Mobile Development",
    expanded: "Limited screen real estate, battery constraints, and network variability force you to prioritize what's truly essential.",
    icon: Code,
    size: "normal",
  },
  {
    id: 14,
    quote: "The best mobile apps are invisible to users. They solve problems without demanding attention.",
    category: "Mobile UX",
    expanded: "Great mobile design anticipates user needs and provides seamless experiences that feel natural and effortless.",
    icon: Users,
    size: "large",
  },
  {
    id: 15,
    quote: "Cross-platform frameworks are great for MVPs, but native code wins for performance-critical features.",
    category: "Mobile Architecture",
    expanded: "Start with React Native or Flutter for rapid development, but don't hesitate to drop to native when performance matters.",
    icon: Server,
    size: "normal",
  },
  {
    id: 16,
    quote: "PHP isn't dead—it's just evolved. Modern PHP with frameworks like Laravel and Symfony rivals any modern web technology.",
    category: "PHP Development",
    expanded: "PHP 8+ with proper architecture, testing, and modern practices creates maintainable, scalable applications that perform exceptionally well.",
    icon: Code,
    size: "normal",
  },
  {
    id: 17,
    quote: "Composer revolutionized PHP development. Dependency management changed everything about how we build PHP applications.",
    category: "PHP Ecosystem",
    expanded: "Before Composer, PHP lacked proper package management. Now we have a rich ecosystem of high-quality, well-tested libraries.",
    icon: Zap,
    size: "normal",
  },
  {
    id: 18,
    quote: "Laravel's ecosystem isn't just a framework—it's a complete development philosophy that emphasizes developer experience.",
    category: "Laravel Framework",
    expanded: "Laravel doesn't just make PHP easier; it makes development more enjoyable and productive through thoughtful design and comprehensive tooling.",
    icon: Rocket,
    size: "large",
  },
  {
    id: 19,
    quote: "Blockchain isn't just cryptocurrency—it's a fundamental shift in how we think about trust, transparency, and decentralized systems.",
    category: "Blockchain Technology",
    expanded: "The real power of blockchain lies in its ability to create trustless systems where intermediaries become unnecessary.",
    icon: Zap,
    size: "normal",
  },
  {
    id: 20,
    quote: "Smart contracts are self-executing agreements that run on blockchain, but they're only as good as the code they're written in.",
    category: "Smart Contracts",
    expanded: "Security is paramount in smart contract development. Every line of code represents real financial value and potential risk.",
    icon: Shield,
    size: "normal",
  },
  {
    id: 21,
    quote: "DeFi represents the future of finance, but it requires a deep understanding of both blockchain technology and traditional financial systems.",
    category: "DeFi & Web3",
    expanded: "Building DeFi protocols demands expertise in cryptography, economics, and user experience design.",
    icon: Brain,
    size: "wide",
  },
];

const InsightCard = ({ insight, index }: { insight: Insight; index: number }) => {
  const Icon = insight.icon;
  
  const getSizeClasses = () => {
    switch (insight.size) {
      case "large":
        return "md:col-span-1 md:row-span-2";
      case "wide":
        return "md:col-span-2 md:row-span-1";
      default:
        return "md:col-span-1 md:row-span-1";
    }
  };

  const isLarge = insight.size === "large";
  const isWide = insight.size === "wide";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative ${getSizeClasses()}`}
    >
      <div className={`relative h-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/30 ${isLarge ? 'p-10' : isWide ? 'p-8' : 'p-6'}`}>
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 transition-all duration-700 group-hover:opacity-100"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 5 }}
        />

        {/* Floating icon background */}
        <motion.div
          className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className={`${isLarge ? 'w-40 h-40' : 'w-28 h-28'} text-primary`} />
        </motion.div>

        {/* Quote mark */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ delay: 0.3 + index * 0.05 }}
          className={`absolute left-4 top-2 font-serif text-primary ${isLarge ? 'text-9xl' : 'text-7xl'}`}
        >
          "
        </motion.div>

        <div className="relative z-10 flex h-full flex-col">
          {/* Icon and Category */}
          <div className="mb-4 flex items-center gap-3">
            <motion.div 
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <div className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1">
              <span className="font-display text-xs tracking-wider text-secondary">
                {insight.category}
              </span>
            </div>
          </div>

          {/* Quote */}
          <p className={`mb-4 flex-1 font-serif italic leading-relaxed text-foreground/90 ${isLarge ? 'text-2xl md:text-3xl' : isWide ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            {insight.quote}
          </p>

          {/* Expanded text */}
          {insight.expanded && (
            <motion.p 
              className={`font-body leading-relaxed text-muted-foreground ${isLarge || isWide ? 'text-sm' : 'text-xs'}`}
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              {insight.expanded}
            </motion.p>
          )}

          {/* Bottom gradient line */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
            initial={{ width: "0%" }}
            whileInView={{ width: isLarge || isWide ? "60%" : "40%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.8 }}
          />
        </div>

        {/* Corner accent */}
        <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow effect on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: "inset 0 0 60px rgba(0, 180, 216, 0.1), 0 0 40px rgba(0, 180, 216, 0.05)"
          }}
        />
      </div>
    </motion.div>
  );
};

const InsightsPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pb-20 pt-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
        
        {/* Grid pattern background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100, 100, 100, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 100, 100, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Corner geometric accents */}
        <div className="absolute left-8 top-32 h-40 w-40 border-l-2 border-t-2 border-gray-500/30" />
        <div className="absolute right-8 top-32 h-40 w-40 border-r-2 border-t-2 border-gray-500/30" />
        <div className="absolute bottom-20 left-8 h-40 w-40 border-b-2 border-l-2 border-gray-500/30" />
        <div className="absolute bottom-20 right-8 h-40 w-40 border-b-2 border-r-2 border-gray-500/30" />
        
        {/* Circle accents */}
        <div className="absolute right-1/4 top-48 h-64 w-64 rounded-full border border-gray-500/10" />
        <div className="absolute left-1/4 bottom-48 h-48 w-48 rounded-full border border-gray-500/10" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.02]">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full bg-primary"
              style={{ top: `${i * 12}%` }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
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
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20"
            >
              <Lightbulb className="h-8 w-8 text-primary" />
            </motion.div>
            
            <h1 className="font-display text-4xl font-bold tracking-wider md:text-5xl">
              INSIGHTS & <span className="text-neon-magenta">PHILOSOPHY</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground">
              Lessons learned from 6+ years of building software, leading teams, and
              delivering AI-powered, full-stack, mobile, PHP, and blockchain solutions. Practical wisdom for technical leaders and builders.
            </p>
          </motion.div>

          {/* Creative Bento Grid Layout */}
          <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allInsights.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default InsightsPage;
