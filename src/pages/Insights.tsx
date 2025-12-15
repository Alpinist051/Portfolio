import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Insight {
  id: number;
  quote: string;
  category: string;
  expanded?: string;
}

const allInsights: Insight[] = [
  {
    id: 1,
    quote: "AI is not about replacing humans—it's about amplifying human potential and automating the mundane.",
    category: "AI Strategy",
    expanded: "The most successful AI implementations I've built focus on augmenting human decision-making rather than removing humans from the loop. The goal should be to free your team from repetitive tasks so they can focus on creative, high-value work.",
  },
  {
    id: 2,
    quote: "The best code is the code that doesn't exist. Simplicity should always be your first instinct.",
    category: "Development Philosophy",
    expanded: "Every line of code is a liability—it needs to be maintained, tested, and understood by future developers. Before writing anything, ask yourself: is there a simpler solution? Can we use an existing library? Do we even need this feature?",
  },
  {
    id: 3,
    quote: "Start with a working prototype before perfecting. Your users' feedback is worth more than your assumptions.",
    category: "Product Development",
    expanded: "I've seen too many projects fail because teams spent months building the 'perfect' solution in isolation. Ship early, gather feedback, iterate. The first version should answer one question: does anyone actually want this?",
  },
  {
    id: 4,
    quote: "Invest in your data infrastructure early. AI solutions are only as good as the data they learn from.",
    category: "AI/ML Best Practices",
    expanded: "Garbage in, garbage out. Before building any ML model, ensure you have clean, well-structured data pipelines. Data quality, versioning, and governance should be treated as first-class citizens in your architecture.",
  },
  {
    id: 5,
    quote: "Microservices aren't always the answer. Start with a well-structured monolith unless you have a clear reason not to.",
    category: "Architecture",
    expanded: "The overhead of distributed systems is significant. Unless you have a team large enough to own separate services, or specific scalability requirements, a modular monolith is often the more pragmatic choice.",
  },
  {
    id: 6,
    quote: "Technical debt is like financial debt—sometimes it's strategic, but always pay attention to the interest.",
    category: "Engineering Leadership",
    expanded: "Taking on debt to ship faster can be the right call. The problem is when teams stop tracking it. Keep a technical debt register, estimate the 'interest' cost in maintenance time, and allocate regular time to pay it down.",
  },
  {
    id: 7,
    quote: "The most expensive software projects are those that solve the wrong problem perfectly.",
    category: "Product Development",
    expanded: "Before diving into implementation, spend time deeply understanding the problem. Talk to users, question assumptions, and validate that you're solving a real pain point. Building the right thing is more important than building the thing right.",
  },
  {
    id: 8,
    quote: "Cloud costs are the new infrastructure—monitor them like you would server uptime.",
    category: "DevOps",
    expanded: "I've helped companies reduce cloud bills by 60% simply by implementing proper monitoring and right-sizing. Set up cost alerts, review spending weekly, and treat cloud resources as finite. The cloud's infinite scalability can lead to infinite bills.",
  },
  {
    id: 9,
    quote: "Documentation is not optional. Your future self and your team will thank you.",
    category: "Best Practices",
    expanded: "Every hour spent on documentation saves ten hours of onboarding and debugging. Write docs as you build, not after. Include the 'why' behind decisions, not just the 'how'. Treat your README like a product.",
  },
  {
    id: 10,
    quote: "Security is not a feature—it's a foundation. Build it in from day one, not as an afterthought.",
    category: "Security",
    expanded: "Retrofitting security is expensive and often incomplete. Establish security practices early: code reviews, dependency scanning, secrets management, and principle of least privilege. The cost of a breach far exceeds the cost of prevention.",
  },
  {
    id: 11,
    quote: "The best teams I've worked with ship small changes frequently rather than big releases rarely.",
    category: "Engineering Culture",
    expanded: "Small, incremental deployments reduce risk, speed up feedback loops, and keep teams motivated. If your deployment process is scary, fix the process—don't deploy less often.",
  },
  {
    id: 12,
    quote: "AI can help you code faster, but it can't help you think better. Invest in understanding fundamentals.",
    category: "AI Strategy",
    expanded: "Copilots and code generators are powerful tools, but they're amplifiers, not replacements for knowledge. Understanding algorithms, system design, and computer science fundamentals will make you a better developer and a better AI user.",
  },
];

const InsightCard = ({ insight, index }: { insight: Insight; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/30 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.05 }}
          className="absolute -left-4 -top-4 font-serif text-8xl text-primary"
        >
          "
        </motion.div>

        <div className="relative z-10">
          <div className="mb-4 inline-block rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1">
            <span className="font-display text-xs tracking-wider text-secondary">
              {insight.category}
            </span>
          </div>

          <p className="mb-4 font-serif text-xl italic leading-relaxed text-foreground/90 md:text-2xl">
            {insight.quote}
          </p>

          {insight.expanded && (
            <p className="font-body text-sm leading-relaxed text-muted-foreground">
              {insight.expanded}
            </p>
          )}
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"
          initial={{ width: "0%" }}
          whileInView={{ width: "40%" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.05, duration: 0.8 }}
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
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pointer-events-none absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-3xl"
        />

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
            <h1 className="font-display text-4xl font-bold tracking-wider md:text-5xl">
              INSIGHTS & <span className="text-neon-magenta">PHILOSOPHY</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground">
              Lessons learned from 6+ years of building software, leading teams, and 
              delivering AI-powered solutions. Practical wisdom for technical leaders and builders.
            </p>
          </motion.div>

          {/* Insights grid */}
          <div className="grid gap-6 md:grid-cols-2">
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
