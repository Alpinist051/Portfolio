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
  // Check if this is a navigation (not refresh) using navigation entry
  const isNavigation = performance.getEntriesByType("navigation")[0]?.toJSON?.()?.type === "navigate" 
    && sessionStorage.getItem("hasVisited") === "true";
  
  const [isLoading, setIsLoading] = useState(!isNavigation);
  const [showContent, setShowContent] = useState(isNavigation);

  useEffect(() => {
    // Mark that user has visited during this session
    sessionStorage.setItem("hasVisited", "true");
    
    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
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
