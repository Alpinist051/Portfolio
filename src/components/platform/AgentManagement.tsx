import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bot, Plus, Settings, Trash2, Power, PowerOff,
  Brain, Wrench, MessageSquare, Shield, Link2,
  Zap, Database, Globe, FileText, Image,
  CheckCircle2, AlertTriangle, Clock, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Agent {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "error";
  agent_type: "assistant" | "analyst" | "executor" | "coordinator";
  tools: string[];
  knowledge: string[];
  coordinates_with: string[];
  success_rate: number;
  tasks_completed: number;
  last_active: string | null;
}

const availableTools = [
  { id: "web_search", name: "Web Search", icon: Globe },
  { id: "database", name: "Database Query", icon: Database },
  { id: "file_ops", name: "File Operations", icon: FileText },
  { id: "image_gen", name: "Image Generation", icon: Image },
  { id: "api_call", name: "API Calls", icon: Wrench },
];

interface AgentManagementProps {
  userId: string;
}

const AgentManagement = ({ userId }: AgentManagementProps) => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAgents = useCallback(async () => {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load agents", variant: "destructive" });
      return;
    }

    const typedData = (data || []) as Agent[];
    setAgents(typedData);
    if (typedData.length > 0 && !selectedAgent) {
      setSelectedAgent(typedData[0]);
    }
    setLoading(false);
  }, [userId, selectedAgent, toast]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const toggleAgentStatus = async (id: string) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;

    const newStatus = agent.status === "active" ? "inactive" : "active";

    const { error } = await supabase
      .from("agents")
      .update({ status: newStatus, last_active: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      if (selectedAgent?.id === id) {
        setSelectedAgent((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
      toast({ title: "Agent updated" });
    }
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
      default:
        return null;
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

  const addNewAgent = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("agents")
      .insert({
        user_id: userId,
        name: "New Agent",
        description: "Configure this agent's purpose",
        status: "inactive",
        agent_type: "assistant",
        tools: [],
        knowledge: [],
        coordinates_with: [],
        success_rate: 0,
        tasks_completed: 0,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to create agent", variant: "destructive" });
    } else if (data) {
      const typedData = data as Agent;
      setAgents((prev) => [typedData, ...prev]);
      setSelectedAgent(typedData);
      toast({ title: "Agent created", description: "Configure the agent settings" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Agent List */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-4">
            <h3 className="font-display text-lg font-semibold text-stone-800">AI Agents</h3>
            <Button size="sm" onClick={addNewAgent} className="bg-stone-800 hover:bg-stone-700" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
              New
            </Button>
          </div>

          <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
            {agents.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                <Bot className="mx-auto mb-2 h-8 w-8 text-stone-300" />
                <p>No agents yet</p>
                <p className="text-sm">Create your first AI agent</p>
              </div>
            ) : (
              agents.map((agent) => (
                <motion.button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  whileHover={{ backgroundColor: "rgb(250 250 249)" }}
                  className={`w-full p-4 text-left transition-colors ${
                    selectedAgent?.id === agent.id ? "bg-stone-50 border-l-4 border-l-stone-600" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTypeColor(agent.agent_type)}`}>
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">{agent.name}</h4>
                      <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">{agent.description}</p>
                      <div className="mt-2">{getStatusBadge(agent.status)}</div>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Agent Details */}
      <div className="lg:col-span-2">
        {selectedAgent ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${getTypeColor(selectedAgent.agent_type)}`}>
                    <Bot className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-xl font-semibold text-stone-800">{selectedAgent.name}</h2>
                      {getStatusBadge(selectedAgent.status)}
                    </div>
                    <p className="mt-1 text-stone-600">{selectedAgent.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-stone-500">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getTypeColor(selectedAgent.agent_type)}`}>
                        {selectedAgent.agent_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {selectedAgent.last_active ? new Date(selectedAgent.last_active).toLocaleString() : "Never"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleAgentStatus(selectedAgent.id)}>
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

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-stone-100 pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-800">{selectedAgent.success_rate}%</p>
                  <p className="text-sm text-stone-500">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-800">{selectedAgent.tasks_completed.toLocaleString()}</p>
                  <p className="text-sm text-stone-500">Tasks Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-800">{selectedAgent.tools.length}</p>
                  <p className="text-sm text-stone-500">Tools Enabled</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-800">
                    <Wrench className="h-5 w-5 text-stone-500" />
                    Tools & APIs
                  </h3>
                  <Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2">
                  {availableTools.map((tool) => {
                    const isEnabled = selectedAgent.tools.includes(tool.id);
                    const Icon = tool.icon;
                    return (
                      <div
                        key={tool.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          isEnabled ? "border-green-200 bg-green-50" : "border-stone-100 bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isEnabled ? "text-green-600" : "text-stone-400"}`} />
                          <span className={isEnabled ? "text-green-700" : "text-stone-500"}>{tool.name}</span>
                        </div>
                        {isEnabled && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-800">
                    <Brain className="h-5 w-5 text-stone-500" />
                    Knowledge Base
                  </h3>
                  <Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2">
                  {selectedAgent.knowledge.length > 0 ? (
                    selectedAgent.knowledge.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 p-3">
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
                    <p className="py-4 text-center text-sm text-stone-400">No knowledge sources added</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-800">
                  <Link2 className="h-5 w-5 text-stone-500" />
                  Coordinates With
                </h3>
                <Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.coordinates_with.length > 0 ? (
                  selectedAgent.coordinates_with.map((agentName, index) => (
                    <span key={index} className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-600">
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
