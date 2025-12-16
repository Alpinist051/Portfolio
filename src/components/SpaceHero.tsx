import { motion } from "framer-motion";

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Empty hero section */}
      <div className="flex h-full items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground"
        >
          Hero Section
        </motion.p>
      </div>
    </section>
  );
};

export default SpaceHero;