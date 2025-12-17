import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const insights = [
  {
    id: 1,
    quote: "AI is not about replacing humans—it's about amplifying human potential and automating the mundane.",
    category: "AI Strategy",
  },
  {
    id: 2,
    quote: "The best code is the code that doesn't exist. Simplicity should always be your first instinct.",
    category: "Development Philosophy",
  },
  {
    id: 3,
    quote: "Start with a working prototype before perfecting. Your users' feedback is worth more than your assumptions.",
    category: "Product Development",
  },
  {
    id: 4,
    quote: "Invest in your data infrastructure early. AI solutions are only as good as the data they learn from.",
    category: "AI/ML Best Practices",
  },
];

const InsightCard = ({ insight, index }: { insight: typeof insights[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100" />
      
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/30 p-8 backdrop-blur-sm">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 transition-all duration-500 group-hover:opacity-100"
        />
        
        {/* Quote icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="absolute -left-2 -top-2 font-serif text-8xl text-cyan-500/30"
        >
          "
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <p className="mb-6 font-serif text-lg italic leading-relaxed text-foreground/90 md:text-xl">
            {insight.quote}
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-display text-xs tracking-wider text-cyan-400">
              {insight.category}
            </span>
          </div>
        </div>

        {/* Corner glow */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Bottom gradient line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          whileInView={{ width: "40%" }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
};

const ToClientsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="insights" className="relative overflow-hidden bg-[#fafafa] py-32" ref={ref}>
      {/* Grid pattern background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200, 200, 200, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Corner geometric accents */}
      <div className="absolute left-8 top-8 h-24 w-24 border-l-2 border-t-2 border-gray-300/60" />
      <div className="absolute right-8 top-8 h-24 w-24 border-r-2 border-t-2 border-gray-300/60" />
      <div className="absolute bottom-8 left-8 h-24 w-24 border-b-2 border-l-2 border-gray-300/60" />
      <div className="absolute bottom-8 right-8 h-24 w-24 border-b-2 border-r-2 border-gray-300/60" />
      {/* Circle accent */}
      <div className="absolute right-1/4 top-20 h-40 w-40 rounded-full border border-gray-300/30" />
      {/* Book page curl effect */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-stone-300/50 via-stone-200/30 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-stone-400/40 to-stone-300/20" />
      <div className="pointer-events-none absolute left-2 top-0 h-full w-1 shadow-[2px_0_8px_rgba(0,0,0,0.1)]" />

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
              className="text-stone-700"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          
          {/* Vertical line */}
          <div className="mb-4 h-8 w-px bg-stone-400" />
          
          {/* Title with watermark effect */}
          <div className="relative">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-5xl font-bold uppercase tracking-widest text-stone-200 md:text-7xl">
              INSIGHTS
            </span>
            <h2 className="relative z-10 font-display text-3xl font-bold tracking-wider text-stone-800 md:text-4xl">
              Insights
            </h2>
          </div>
          
          <p className="mx-auto mt-6 max-w-2xl font-body text-stone-600">
            Thoughts on technology and building successful products.
          </p>
        </motion.div>

        {/* Insights grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {insights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} />
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            to="/insights"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border border-cyan-500/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-8 py-4 font-display text-sm font-semibold tracking-wider text-cyan-400 backdrop-blur-sm transition-all hover:border-cyan-400 hover:from-cyan-500/20 hover:to-blue-500/20"
          >
            <span className="relative z-10">VIEW ALL INSIGHTS</span>
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
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ToClientsSection;
