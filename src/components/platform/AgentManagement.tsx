import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, Plus, Settings, Trash2, Power, PowerOff,
  Brain, Wrench, MessageSquare, Shield, Link2,
  Zap, Database, Globe, FileText, Image,
  CheckCircle2, AlertTriangle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "error";
  type: "assistant" | "analyst" | "executor" | "coordinator";
  tools: string[];
  knowledge: string[];
  coordinatesWith: string[];
  successRate: number;
  tasksCompleted: number;
  lastActive: string;
}

const agentTypes = [
  { type: "assistant", name: "Assistant", icon: MessageSquare, color: "blue" },
  { type: "analyst", name: "Analyst", icon: Brain, color: "purple" },
  { type: "executor", name: "Executor", icon: Zap, color: "green" },
  { type: "coordinator", name: "Coordinator", icon: Link2, color: "amber" },
];

const availableTools = [
  { id: "web_search", name: "Web Search", icon: Globe },
  { id: "database", name: "Database Query", icon: Database },
  { id: "file_ops", name: "File Operations", icon: FileText },
  { id: "image_gen", name: "Image Generation", icon: Image },
  { id: "api_call", name: "API Calls", icon: Wrench },
];

const AgentManagement = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Lead Qualifier",
      description: "Analyzes incoming leads and scores them based on fit criteria",
      status: "active",
      type: "analyst",
      tools: ["database", "web_search"],
      knowledge: ["Sales playbook", "ICP definition", "Scoring rubric"],
      coordinatesWith: ["Sales Router", "Email Composer"],
      successRate: 94,
      tasksCompleted: 1247,
      lastActive: "Just now"
    },
    {
      id: "2",
      name: "Sales Router",
      description: "Routes qualified leads to appropriate sales representatives",
      status: "active",
      type: "coordinator",
      tools: ["database", "api_call"],
      knowledge: ["Team assignments", "Territory mapping", "Capacity rules"],
      coordinatesWith: ["Lead Qualifier"],
      successRate: 98,
      tasksCompleted: 892,
      lastActive: "2 min ago"
    },
    {
      id: "3",
      name: "Email Composer",
      description: "Drafts personalized outreach emails based on lead context",
      status: "active",
      type: "assistant",
      tools: ["web_search", "file_ops"],
      knowledge: ["Brand voice", "Email templates", "Compliance rules"],
      coordinatesWith: ["Lead Qualifier", "Content Reviewer"],
      successRate: 89,
      tasksCompleted: 756,
      lastActive: "5 min ago"
    },
    {
      id: "4",
      name: "Content Reviewer",
      description: "Reviews and approves generated content for compliance",
      status: "inactive",
      type: "analyst",
      tools: ["file_ops"],
      knowledge: ["Brand guidelines", "Legal requirements", "Approval criteria"],
      coordinatesWith: ["Email Composer"],
      successRate: 100,
      tasksCompleted: 423,
      lastActive: "1 hour ago"
    },
    {
      id: "5",
      name: "Report Generator",
      description: "Creates automated reports from system data",
      status: "error",
      type: "executor",
      tools: ["database", "file_ops", "image_gen"],
      knowledge: ["Report templates", "KPI definitions", "Chart standards"],
      coordinatesWith: [],
      successRate: 76,
      tasksCompleted: 89,
      lastActive: "Error state"
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0]);
  const [showNewAgent, setShowNewAgent] = useState(false);

  const toggleAgentStatus = (id: string) => {
    setAgents(prev => prev.map(a => 
      a.id === id 
        ? { ...a, status: a.status === "active" ? "inactive" : "active" }
        : a
    ));
    toast({
      title: "Agent updated",
      description: "Status changed successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": 
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Inactive
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            <AlertTriangle className="h-3 w-3" />
            Error
          </span>
        );
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "assistant": return "bg-blue-100 text-blue-700";
      case "analyst": return "bg-purple-100 text-purple-700";
      case "executor": return "bg-green-100 text-green-700";
      case "coordinator": return "bg-amber-100 text-amber-700";
      default: return "bg-stone-100 text-stone-700";
    }
  };

  const addNewAgent = () => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: "New Agent",
      description: "Configure this agent's purpose",
      status: "inactive",
      type: "assistant",
      tools: [],
      knowledge: [],
      coordinatesWith: [],
      successRate: 0,
      tasksCompleted: 0,
      lastActive: "Never"
    };
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgent(newAgent);
    setShowNewAgent(false);
    toast({
      title: "Agent created",
      description: "Configure the agent settings",
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Agent List */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-4">
            <h3 className="font-display text-lg font-semibold text-stone-800">AI Agents</h3>
            <Button size="sm" onClick={addNewAgent} className="bg-stone-800 hover:bg-stone-700">
              <Plus className="mr-1 h-4 w-4" />
              New
            </Button>
          </div>
          
          <div className="divide-y divide-stone-100">
            {agents.map((agent) => (
              <motion.button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                whileHover={{ backgroundColor: "rgb(250 250 249)" }}
                className={`w-full p-4 text-left transition-colors ${
                  selectedAgent?.id === agent.id ? "bg-stone-50 border-l-4 border-l-stone-600" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTypeColor(agent.type)}`}>
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">{agent.name}</h4>
                      <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">{agent.description}</p>
                      <div className="mt-2">
                        {getStatusBadge(agent.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Details */}
      <div className="lg:col-span-2">
        {selectedAgent ? (
          <div className="space-y-6">
            {/* Agent Header */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${getTypeColor(selectedAgent.type)}`}>
                    <Bot className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-xl font-semibold text-stone-800">{selectedAgent.name}</h2>
                      {getStatusBadge(selectedAgent.status)}
                    </div>
                    <p className="mt-1 text-stone-600">{selectedAgent.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-stone-500">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getTypeColor(selectedAgent.type)}`}>
                        {selectedAgent.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {selectedAgent.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleAgentStatus(selectedAgent.id)}
                  >
                    {selectedAgent.status === "active" ? (
                      <><PowerOff className="mr-1 h-4 w-4" /> Deactivate</>
                    ) : (
                      <><Power className="mr-1 h-4 w-4" /> Activate</>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-stone-100 pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-800">{selectedAgent.successRate}%</p>
                  <p className="text-sm text-stone-500">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-800">{selectedAgent.tasksCompleted.toLocaleString()}</p>
                  <p className="text-sm text-stone-500">Tasks Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-800">{selectedAgent.tools.length}</p>
                  <p className="text-sm text-stone-500">Tools Enabled</p>
                </div>
              </div>
            </div>

            {/* Tools & Knowledge */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Tools */}
              <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-800">
                    <Wrench className="h-5 w-5 text-stone-500" />
                    Tools & APIs
                  </h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {availableTools.map((tool) => {
                    const isEnabled = selectedAgent.tools.includes(tool.id);
                    const Icon = tool.icon;
                    return (
                      <div 
                        key={tool.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          isEnabled 
                            ? "border-green-200 bg-green-50" 
                            : "border-stone-100 bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isEnabled ? "text-green-600" : "text-stone-400"}`} />
                          <span className={isEnabled ? "text-green-700" : "text-stone-500"}>
                            {tool.name}
                          </span>
                        </div>
                        {isEnabled && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Knowledge */}
              <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-800">
                    <Brain className="h-5 w-5 text-stone-500" />
                    Knowledge Base
                  </h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedAgent.knowledge.length > 0 ? (
                    selectedAgent.knowledge.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-stone-400" />
                          <span className="text-stone-600">{item}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-stone-400 hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-stone-400 py-4">No knowledge sources added</p>
                  )}
                </div>
              </div>
            </div>

            {/* Coordination */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-800">
                  <Link2 className="h-5 w-5 text-stone-500" />
                  Coordinates With
                </h3>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.coordinatesWith.length > 0 ? (
                  selectedAgent.coordinatesWith.map((agentName, index) => (
                    <span 
                      key={index}
                      className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-600"
                    >
                      <Bot className="h-3.5 w-3.5" />
                      {agentName}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-stone-400">No agent coordination configured</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center rounded-xl border border-stone-200 bg-white">
            <div className="text-center">
              <Bot className="mx-auto h-12 w-12 text-stone-300" />
              <p className="mt-2 text-stone-500">Select an agent to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;
