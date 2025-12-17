import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
}

const certifications: Certification[] = [
  {
    id: 1,
    title: "AWS Solutions Architect Professional",
    issuer: "Amazon Web Services",
    date: "2024",
    credentialId: "AWS-SAP-2024",
  },
  {
    id: 2,
    title: "Google Cloud Professional ML Engineer",
    issuer: "Google Cloud",
    date: "2023",
    credentialId: "GCP-MLE-2023",
  },
  {
    id: 3,
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2023",
    credentialId: "TF-DEV-2023",
  },
  {
    id: 4,
    title: "Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    date: "2023",
    credentialId: "CKA-2023",
  },
  {
    id: 5,
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    date: "2022",
    credentialId: "DL-SPEC-2022",
  },
  {
    id: 6,
    title: "Meta Front-End Developer",
    issuer: "Meta",
    date: "2022",
    credentialId: "META-FED-2022",
  },
];

const CertificationCard = ({ cert, index }: { cert: Certification; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
      className="group relative h-full"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100" />
      
      {/* Card */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/30 p-6 backdrop-blur-sm transition-all duration-300">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 transition-all duration-500 group-hover:opacity-100"
        />
        
        {/* Decorative badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm"
        >
          <svg className="h-6 w-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col pr-16">
          <h3 className="mb-2 font-display text-lg font-semibold tracking-wide text-foreground transition-colors group-hover:text-cyan-400 md:text-xl">
            {cert.title}
          </h3>
          <p className="mb-3 font-body text-sm text-muted-foreground">{cert.issuer}</p>

          <div className="mt-auto flex items-center gap-4 border-t border-border/50 pt-4">
            <div className="rounded-lg bg-cyan-500/10 px-3 py-1.5">
              <span className="font-body text-xs text-cyan-400">{cert.date}</span>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground/70">{cert.credentialId}</p>
            </div>
          </div>
        </div>

        {/* Corner glow */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Bottom gradient line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          whileInView={{ width: "30%" }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
};

const CertificationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" className="relative overflow-hidden bg-[#fafafa] py-32" ref={ref}>
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
      <div className="absolute right-8 bottom-8 h-24 w-24 border-b-2 border-r-2 border-gray-300/60" />
      {/* Subtle circle accents */}
      <div className="absolute right-20 top-40 h-48 w-48 rounded-full border border-gray-300/30" />
      <div className="absolute left-20 bottom-40 h-32 w-32 rounded-full border border-gray-300/20" />
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
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          
          {/* Vertical line */}
          <div className="mb-4 h-8 w-px bg-stone-400" />
          
          {/* Title with watermark effect */}
          <div className="relative">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-5xl font-bold uppercase tracking-widest text-stone-200 md:text-7xl">
              CERTIFICATIONS
            </span>
            <h2 className="relative z-10 font-display text-3xl font-bold tracking-wider text-stone-800 md:text-4xl">
              Certifications
            </h2>
          </div>
          
          <p className="mx-auto mt-6 max-w-2xl font-body text-stone-600">
            Industry-recognized certifications and achievements.
          </p>
        </motion.div>

        {/* Certifications grid */}
        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <CertificationCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CertificationsSection;
