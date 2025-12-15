import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import SpaceHero from "@/components/SpaceHero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificationsSection from "@/components/CertificationsSection";
import ContactSection from "@/components/ContactSection";
import ToClientsSection from "@/components/ToClientsSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Only show loading on initial page load/refresh, not on navigation
  const hasLoaded = sessionStorage.getItem("hasLoaded");
  const [isLoading, setIsLoading] = useState(!hasLoaded);
  const [showContent, setShowContent] = useState(!!hasLoaded);

  useEffect(() => {
    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Mark as loaded for this session
      sessionStorage.setItem("hasLoaded", "true");
      // Delay showing content for smooth transition
      setTimeout(() => setShowContent(true), 100);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen bg-background"
        >
          <Navigation />
          <SpaceHero />
          <AboutSection />
          <ProjectsSection />
          <CertificationsSection />
          <ContactSection />
          <ToClientsSection />
          <Footer />
        </motion.main>
      )}
    </>
  );
};

export default Index;
