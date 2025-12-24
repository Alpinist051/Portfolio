import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WorkflowBuilder from "@/components/platform/WorkflowBuilder";
import AgentManagement from "@/components/platform/AgentManagement";
import DashboardMonitoring from "@/components/platform/DashboardMonitoring";
import AuthForm from "@/components/platform/AuthForm";
import { Workflow, Bot, Activity, Layers, LogOut, Loader2, Info, Zap, Brain, Shield, Clock, Globe, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type TabType = "workflows" | "agents" | "dashboard" | "about";

interface User {
  id: string;
  email?: string;
}

// About Section Component
const AboutSection = () => {
  const features = [
    {
      icon: Workflow,
      title: "Visual Workflow Builder",
      description: "Design complex automation workflows with an intuitive drag-and-drop interface. Connect triggers, actions, and conditions to create powerful automation sequences.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Bot,
      title: "AI-Powered Agents",
      description: "Deploy intelligent agents that learn and adapt to your needs. Configure assistants, analysts, executors, and coordinators to handle diverse tasks autonomously.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Brain,
      title: "Smart Decision Making",
      description: "Leverage AI to make context-aware decisions within your workflows. Agents analyze data, recognize patterns, and take optimal actions.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Clock,
      title: "Scheduled Automation",
      description: "Set up recurring workflows with flexible scheduling options. Run automations every 5 minutes, hourly, daily, or weekly based on your requirements.",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with end-to-end encryption. Your data and workflows are protected with robust authentication and access controls.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Globe,
      title: "API Integrations",
      description: "Connect to external services and APIs seamlessly. Integrate with databases, email services, webhooks, and third-party applications.",
      color: "bg-cyan-100 text-cyan-600"
    }
  ];

  const agentTypes = [
    {
      type: "Assistant",
      icon: Bot,
      description: "General-purpose agents that handle conversations, answer questions, and assist with various tasks.",
      capabilities: ["Natural language processing", "Task management", "Information retrieval", "User support"]
    },
    {
      type: "Analyst",
      icon: Brain,
      description: "Data-focused agents that analyze information, identify patterns, and generate insights.",
      capabilities: ["Data analysis", "Report generation", "Trend detection", "Predictive modeling"]
    },
    {
      type: "Executor",
      icon: Zap,
      description: "Action-oriented agents that perform specific tasks, run operations, and manage processes.",
      capabilities: ["Task execution", "Process automation", "API calls", "File operations"]
    },
    {
      type: "Coordinator",
      icon: Layers,
      description: "Orchestration agents that manage other agents, delegate tasks, and ensure smooth operations.",
      capabilities: ["Agent coordination", "Workflow management", "Resource allocation", "Priority handling"]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 p-8 text-white shadow-xl md:p-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-amber-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-amber-400">About This Platform</span>
        </div>
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Workflow Automation & AI Agents
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-stone-300">
          A comprehensive platform for building intelligent automation workflows powered by AI agents. 
          Design, deploy, and monitor sophisticated automation sequences that adapt to your business needs 
          and scale with your operations.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Workflow className="h-5 w-5 text-blue-400" />
            <span>Visual Builder</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Bot className="h-5 w-5 text-purple-400" />
            <span>AI Agents</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Activity className="h-5 w-5 text-green-400" />
            <span>Real-time Monitoring</span>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div>
        <h3 className="mb-6 font-display text-2xl font-bold text-stone-800">Platform Features</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="font-display text-lg font-semibold text-stone-800">{feature.title}</h4>
                <p className="mt-2 text-sm text-stone-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Agent Types */}
      <div>
        <h3 className="mb-6 font-display text-2xl font-bold text-stone-800">AI Agent Types</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {agentTypes.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.type}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-stone-100 to-stone-200">
                    <Icon className="h-7 w-7 text-stone-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-xl font-semibold text-stone-800">{agent.type}</h4>
                    <p className="mt-1 text-sm text-stone-600">{agent.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {agent.capabilities.map((cap) => (
                        <span key={cap} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
        <h3 className="mb-6 font-display text-2xl font-bold text-stone-800">How It Works</h3>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { step: 1, title: "Create Workflow", description: "Design your automation flow with triggers and actions" },
            { step: 2, title: "Configure Agents", description: "Set up AI agents with tools and knowledge bases" },
            { step: 3, title: "Connect & Test", description: "Link agents to workflows and run tests" },
            { step: 4, title: "Monitor & Optimize", description: "Track performance and refine your automations" }
          ].map((item, index) => (
            <div key={item.step} className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-lg font-bold text-white">
                  {item.step}
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden h-5 w-5 text-stone-300 md:block absolute right-0 top-2.5" />
                )}
              </div>
              <h4 className="mt-4 font-semibold text-stone-800">{item.title}</h4>
              <p className="mt-1 text-sm text-stone-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl bg-gradient-to-r from-stone-100 to-stone-50 p-8 text-center"
      >
        <h3 className="font-display text-2xl font-bold text-stone-800">Ready to Get Started?</h3>
        <p className="mt-2 text-stone-600">
          Start building your first workflow and deploy AI agents to automate your tasks.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button className="bg-stone-800 hover:bg-stone-700">
            <Workflow className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
          <Button variant="outline">
            <Bot className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const Platform = () => {
  const [activeTab, setActiveTab] = useState<TabType>("workflows");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const tabs = [
    { id: "workflows" as TabType, label: "Workflow Builder", icon: Workflow },
    { id: "agents" as TabType, label: "Agent Management", icon: Bot },
    { id: "dashboard" as TabType, label: "Dashboard", icon: Activity },
    { id: "about" as TabType, label: "About", icon: Info },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navigation />
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navigation />
        <main className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-20">
          <AuthForm onSuccess={() => {}} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pb-20 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="text-center flex-1">
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
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="absolute right-4 top-24">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
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
            {activeTab === "workflows" && <WorkflowBuilder userId={user.id} />}
            {activeTab === "agents" && <AgentManagement userId={user.id} />}
            {activeTab === "dashboard" && <DashboardMonitoring />}
            {activeTab === "about" && <AboutSection />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

export default Platform;
