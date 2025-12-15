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
      <div className="paper-texture relative overflow-hidden rounded-lg p-6 shadow-paper transition-shadow hover:shadow-lg">
        {/* Decorative stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-red-400/60"
        >
          <span className="font-display text-[10px] font-bold tracking-wider text-red-500/70">
            VERIFIED
          </span>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 pr-16">
          <h3 className="mb-2 font-serif text-lg font-semibold text-paper-text transition-colors group-hover:text-primary md:text-xl">
            {cert.title}
          </h3>
          <p className="mb-3 font-body text-sm text-paper-text/70">{cert.issuer}</p>
          
          <div className="flex items-center gap-4 border-t border-paper-border/50 pt-3">
            <div>
              <span className="font-body text-xs text-paper-text/50">Issued</span>
              <p className="font-serif text-sm font-medium text-paper-text">{cert.date}</p>
            </div>
            <div>
              <span className="font-body text-xs text-paper-text/50">Credential ID</span>
              <p className="font-body text-xs text-paper-text/70">{cert.credentialId}</p>
            </div>
          </div>
        </div>

        {/* Paper corner fold */}
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rotate-180 bg-gradient-to-br from-paper-dark to-paper" />

        {/* Underline animation */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
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
    <section id="certifications" className="relative overflow-hidden py-32" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="font-body text-sm tracking-[0.3em] text-accent">CREDENTIALS</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wider md:text-4xl">
            CERTIFICATIONS & <span className="text-neon">ACHIEVEMENTS</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground">
            Continuous learning and professional development through industry-recognized certifications.
          </p>
        </motion.div>

        {/* Certifications grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <CertificationCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2"
        >
          <div className="h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="pointer-events-none absolute -right-20 top-1/3"
        >
          <div className="h-60 w-60 rounded-full bg-secondary/5 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;
