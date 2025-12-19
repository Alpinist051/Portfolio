import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WorkflowBuilder from "@/components/platform/WorkflowBuilder";
import AgentManagement from "@/components/platform/AgentManagement";
import DashboardMonitoring from "@/components/platform/DashboardMonitoring";
import { Workflow, Bot, Activity, Layers } from "lucide-react";

type TabType = "workflows" | "agents" | "dashboard";

const Platform = () => {
  const [activeTab, setActiveTab] = useState<TabType>("workflows");

  const tabs = [
    { id: "workflows" as TabType, label: "Workflow Builder", icon: Workflow },
    { id: "agents" as TabType, label: "Agent Management", icon: Bot },
    { id: "dashboard" as TabType, label: "Dashboard", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pb-20 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm">
            <Layers className="h-4 w-4" />
            <span>Automation Platform</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-800 md:text-4xl">
            Workflow Automation & AI Agents
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-stone-600">
            Build, manage, and monitor intelligent workflows with AI-powered agents
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex justify-center"
        >
          <div className="inline-flex rounded-xl border border-stone-200 bg-white p-1.5 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-stone-800 text-white shadow-md"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "workflows" && <WorkflowBuilder />}
            {activeTab === "agents" && <AgentManagement />}
            {activeTab === "dashboard" && <DashboardMonitoring />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

export default Platform;
