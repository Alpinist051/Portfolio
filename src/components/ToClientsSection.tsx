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
      whileHover={{ scale: 1.02 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-white p-8 shadow-md">
        {/* Quote icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="absolute -left-4 -top-4 font-serif text-9xl text-amber-500/20"
        >
          "
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <p className="mb-6 font-serif text-lg italic leading-relaxed text-stone-700 md:text-xl">
            {insight.quote}
          </p>
          <div className="inline-block rounded-full border border-amber-300 bg-amber-50 px-3 py-1">
            <span className="font-display text-xs tracking-wider text-amber-700">
              {insight.category}
            </span>
          </div>
        </div>

        {/* Hover gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-amber-50 to-stone-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Bottom accent */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300"
          initial={{ width: "0%" }}
          whileInView={{ width: "30%" }}
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
      {/* Book page curl effect */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-stone-300/50 via-stone-200/30 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-stone-400/40 to-stone-300/20" />
      <div className="pointer-events-none absolute left-2 top-0 h-full w-1 shadow-[2px_0_8px_rgba(0,0,0,0.1)]" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="font-body text-sm tracking-[0.3em] text-amber-600">TO CLIENTS</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wider text-stone-800 md:text-4xl">
            INSIGHTS & <span className="text-amber-600">PHILOSOPHY</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-stone-600">
            Thoughts on technology, development, and building successful digital products
            that I share with my clients.
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
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-amber-400 bg-amber-50 px-8 py-4 font-display text-sm font-semibold tracking-wider text-amber-700 transition-all hover:bg-amber-100"
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
