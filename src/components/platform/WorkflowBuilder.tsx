import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Play, Pause, Trash2, Copy, Save, 
  Zap, Clock, Webhook, FileText, Mail, Database,
  GitBranch, CheckCircle2, XCircle,
  Settings, GripVertical,
  Workflow as WorkflowIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WorkflowStep {
  id: string;
  type: "trigger" | "action" | "condition" | "output";
  name: string;
  icon: React.ElementType;
  config: Record<string, string>;
  status: "idle" | "running" | "success" | "error";
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  steps: WorkflowStep[];
  lastRun?: string;
  successRate: number;
}

const triggerOptions = [
  { type: "schedule", name: "Schedule", icon: Clock, description: "Time-based trigger" },
  { type: "webhook", name: "Webhook", icon: Webhook, description: "HTTP endpoint trigger" },
  { type: "event", name: "Event", icon: Zap, description: "Event-based trigger" },
];

const actionOptions = [
  { type: "email", name: "Send Email", icon: Mail, description: "Send notification" },
  { type: "database", name: "Database Query", icon: Database, description: "Query/update data" },
  { type: "api", name: "API Call", icon: Webhook, description: "External API request" },
  { type: "transform", name: "Transform Data", icon: FileText, description: "Process data" },
];

const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Lead Qualification",
      description: "Automatically qualify and route incoming leads",
      status: "active",
      successRate: 94,
      lastRun: "2 min ago",
      steps: [
        { id: "s1", type: "trigger", name: "Webhook Received", icon: Webhook, config: { endpoint: "/api/leads" }, status: "success" },
        { id: "s2", type: "action", name: "Enrich Data", icon: Database, config: { source: "clearbit" }, status: "success" },
        { id: "s3", type: "condition", name: "Score Check", icon: GitBranch, config: { condition: "score > 70" }, status: "running" },
        { id: "s4", type: "output", name: "Notify Sales", icon: Mail, config: { to: "sales@company.com" }, status: "idle" },
      ]
    },
    {
      id: "2", 
      name: "Content Approval",
      description: "Route content through approval workflow",
      status: "paused",
      successRate: 87,
      lastRun: "1 hour ago",
      steps: [
        { id: "s1", type: "trigger", name: "New Content", icon: FileText, config: {}, status: "idle" },
        { id: "s2", type: "action", name: "AI Review", icon: Zap, config: {}, status: "idle" },
        { id: "s3", type: "output", name: "Publish", icon: CheckCircle2, config: {}, status: "idle" },
      ]
    },
    {
      id: "3",
      name: "Daily Report",
      description: "Generate and distribute daily analytics",
      status: "active",
      successRate: 100,
      lastRun: "6 hours ago",
      steps: [
        { id: "s1", type: "trigger", name: "Daily at 6AM", icon: Clock, config: { cron: "0 6 * * *" }, status: "success" },
        { id: "s2", type: "action", name: "Fetch Metrics", icon: Database, config: {}, status: "success" },
        { id: "s3", type: "output", name: "Send Report", icon: Mail, config: {}, status: "success" },
      ]
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0]);
  const [showAddStep, setShowAddStep] = useState(false);

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: w.status === "active" ? "paused" : "active" }
        : w
    ));
    toast({
      title: "Workflow updated",
      description: "Status changed successfully",
    });
  };

  const addNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: "New Workflow",
      description: "Click to configure",
      status: "draft",
      successRate: 0,
      steps: []
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    toast({
      title: "Workflow created",
      description: "Start adding steps to your workflow",
    });
  };

  const addStep = (stepType: typeof triggerOptions[0] | typeof actionOptions[0]) => {
    if (!selectedWorkflow) return;
    
    const newStep: WorkflowStep = {
      id: `s${Date.now()}`,
      type: stepType.type === "schedule" || stepType.type === "webhook" || stepType.type === "event" ? "trigger" : "action",
      name: stepType.name,
      icon: stepType.icon,
      config: {},
      status: "idle"
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep]
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === selectedWorkflow.id ? updatedWorkflow : w));
    setShowAddStep(false);
    
    toast({
      title: "Step added",
      description: `${stepType.name} added to workflow`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "paused": return "bg-amber-100 text-amber-700 border-amber-200";
      case "draft": return "bg-stone-100 text-stone-600 border-stone-200";
      case "running": return "bg-blue-100 text-blue-700 border-blue-200";
      case "success": return "bg-green-100 text-green-700 border-green-200";
      case "error": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-stone-100 text-stone-600 border-stone-200";
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "error": return <XCircle className="h-4 w-4 text-red-600" />;
      case "running": return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-stone-300" />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Workflow List */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-4">
            <h3 className="font-display text-lg font-semibold text-stone-800">Workflows</h3>
            <Button size="sm" onClick={addNewWorkflow} className="bg-stone-800 hover:bg-stone-700">
              <Plus className="mr-1 h-4 w-4" />
              New
            </Button>
          </div>
          
          <div className="divide-y divide-stone-100">
            {workflows.map((workflow) => (
              <motion.button
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow)}
                whileHover={{ backgroundColor: "rgb(250 250 249)" }}
                className={`w-full p-4 text-left transition-colors ${
                  selectedWorkflow?.id === workflow.id ? "bg-stone-50 border-l-4 border-l-stone-600" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-800">{workflow.name}</h4>
                    <p className="mt-1 text-sm text-stone-500">{workflow.description}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                      {workflow.lastRun && (
                        <span className="text-xs text-stone-400">Last: {workflow.lastRun}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-lg font-semibold text-stone-700">{workflow.successRate}%</span>
                    <span className="text-xs text-stone-400">success</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="lg:col-span-2">
        {selectedWorkflow ? (
          <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
            {/* Canvas Header */}
            <div className="flex items-center justify-between border-b border-stone-100 p-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-stone-800">{selectedWorkflow.name}</h3>
                <p className="text-sm text-stone-500">{selectedWorkflow.steps.length} steps configured</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleWorkflowStatus(selectedWorkflow.id)}
                >
                  {selectedWorkflow.status === "active" ? (
                    <><Pause className="mr-1 h-4 w-4" /> Pause</>
                  ) : (
                    <><Play className="mr-1 h-4 w-4" /> Start</>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="mr-1 h-4 w-4" /> Clone
                </Button>
                <Button size="sm" className="bg-stone-800 hover:bg-stone-700">
                  <Save className="mr-1 h-4 w-4" /> Save
                </Button>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="p-6">
              {selectedWorkflow.steps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-stone-100 p-4">
                    <WorkflowIcon className="h-8 w-8 text-stone-400" />
                  </div>
                  <h4 className="font-medium text-stone-700">No steps yet</h4>
                  <p className="mt-1 text-sm text-stone-500">Add a trigger to start building your workflow</p>
                  <Button 
                    className="mt-4 bg-stone-800 hover:bg-stone-700"
                    onClick={() => setShowAddStep(true)}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add First Step
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Step Number & Status */}
                          <div className="flex flex-col items-center">
                            {getStepStatusIcon(step.status)}
                            {index < selectedWorkflow.steps.length - 1 && (
                              <div className="my-1 h-8 w-px bg-stone-200" />
                            )}
                          </div>

                          {/* Step Card */}
                          <div className="flex-1 rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition-all group-hover:border-stone-300 group-hover:shadow-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                                  <StepIcon className="h-5 w-5 text-stone-600" />
                                </div>
                                <div>
                                  <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                    {step.type}
                                  </span>
                                  <h4 className="font-medium text-stone-800">{step.name}</h4>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 cursor-grab p-0">
                                  <GripVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Add Step Button */}
                  <motion.button
                    onClick={() => setShowAddStep(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-200 p-4 text-stone-500 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-600"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Add Step</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Add Step Modal */}
            {showAddStep && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                onClick={() => setShowAddStep(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="mb-4 font-display text-xl font-semibold text-stone-800">Add Step</h3>
                  
                  {selectedWorkflow.steps.length === 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 text-sm font-medium text-stone-600">Triggers</h4>
                      <div className="grid gap-2">
                        {triggerOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.type}
                              onClick={() => addStep(option)}
                              className="flex items-center gap-3 rounded-lg border border-stone-200 p-3 text-left transition-all hover:border-stone-300 hover:bg-stone-50"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                                <Icon className="h-5 w-5 text-stone-600" />
                              </div>
                              <div>
                                <h5 className="font-medium text-stone-800">{option.name}</h5>
                                <p className="text-sm text-stone-500">{option.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="mb-3 text-sm font-medium text-stone-600">Actions</h4>
                    <div className="grid gap-2">
                      {actionOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.type}
                            onClick={() => addStep(option)}
                            className="flex items-center gap-3 rounded-lg border border-stone-200 p-3 text-left transition-all hover:border-stone-300 hover:bg-stone-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                              <Icon className="h-5 w-5 text-stone-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-stone-800">{option.name}</h5>
                              <p className="text-sm text-stone-500">{option.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={() => setShowAddStep(false)}>
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center rounded-xl border border-stone-200 bg-white">
            <div className="text-center">
              <WorkflowIcon className="mx-auto h-12 w-12 text-stone-300" />
              <p className="mt-2 text-stone-500">Select a workflow to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
