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
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Paper card */}
      <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
        {/* Decorative stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-amber-500/60"
        >
          <span className="font-display text-[10px] font-bold tracking-wider text-amber-600/70">
            VERIFIED
          </span>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 pr-16">
          <h3 className="mb-2 font-serif text-lg font-semibold text-stone-800 transition-colors group-hover:text-amber-700 md:text-xl">
            {cert.title}
          </h3>
          <p className="mb-3 font-body text-sm text-stone-600">{cert.issuer}</p>
          
          <div className="flex items-center gap-4 border-t border-stone-200 pt-3">
            <div>
              <span className="font-body text-xs text-stone-400">Issued</span>
              <p className="font-serif text-sm font-medium text-stone-700">{cert.date}</p>
            </div>
            <div>
              <span className="font-body text-xs text-stone-400">Credential ID</span>
              <p className="font-body text-xs text-stone-500">{cert.credentialId}</p>
            </div>
          </div>
        </div>

        {/* Paper corner fold */}
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rotate-180 bg-gradient-to-br from-stone-200 to-white" />

        {/* Underline animation */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300"
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <CertificationCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CertificationsSection;
