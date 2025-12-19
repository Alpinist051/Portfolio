import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Plus, Play, Pause, Trash2, Copy, Save, 
  Zap, Clock, Webhook, FileText, Mail, Database,
  GitBranch, CheckCircle2, XCircle,
  Settings, GripVertical, Loader2,
  Workflow as WorkflowIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowStep {
  id: string;
  workflow_id: string;
  step_type: "trigger" | "action" | "condition" | "output";
  name: string;
  icon_name: string;
  config: Record<string, any>;
  step_order: number;
  status: "idle" | "running" | "success" | "error";
}

interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  success_rate: number;
  last_run: string | null;
  steps?: WorkflowStep[];
}

const iconMap: Record<string, React.ElementType> = {
  Webhook, Clock, Zap, Mail, Database, FileText, GitBranch, CheckCircle2
};

const triggerOptions = [
  { type: "schedule", name: "Schedule", icon: "Clock", description: "Time-based trigger" },
  { type: "webhook", name: "Webhook", icon: "Webhook", description: "HTTP endpoint trigger" },
  { type: "event", name: "Event", icon: "Zap", description: "Event-based trigger" },
];

const actionOptions = [
  { type: "email", name: "Send Email", icon: "Mail", description: "Send notification" },
  { type: "database", name: "Database Query", icon: "Database", description: "Query/update data" },
  { type: "api", name: "API Call", icon: "Webhook", description: "External API request" },
  { type: "transform", name: "Transform Data", icon: "FileText", description: "Process data" },
];

// Sortable Step Component
const SortableStep = ({ 
  step, 
  index, 
  totalSteps,
  onDelete 
}: { 
  step: WorkflowStep; 
  index: number;
  totalSteps: number;
  onDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const StepIcon = iconMap[step.icon_name] || Zap;

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "error": return <XCircle className="h-4 w-4 text-red-600" />;
      case "running": return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-stone-300" />;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          {getStepStatusIcon(step.status)}
          {index < totalSteps - 1 && (
            <div className="my-1 h-8 w-px bg-stone-200" />
          )}
        </div>

        <div className="flex-1 rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition-all group-hover:border-stone-300 group-hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                <StepIcon className="h-5 w-5 text-stone-600" />
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  {step.step_type}
                </span>
                <h4 className="font-medium text-stone-800">{step.name}</h4>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                onClick={() => onDelete(step.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 cursor-grab p-0"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WorkflowBuilderProps {
  userId: string;
}

const WorkflowBuilder = ({ userId }: WorkflowBuilderProps) => {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [showAddStep, setShowAddStep] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch workflows
  const fetchWorkflows = useCallback(async () => {
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load workflows", variant: "destructive" });
      return;
    }

    setWorkflows(data || []);
    if (data && data.length > 0 && !selectedWorkflow) {
      setSelectedWorkflow(data[0]);
    }
    setLoading(false);
  }, [userId, selectedWorkflow, toast]);

  // Fetch steps for selected workflow
  const fetchSteps = useCallback(async (workflowId: string) => {
    const { data, error } = await supabase
      .from("workflow_steps")
      .select("*")
      .eq("workflow_id", workflowId)
      .order("step_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load steps", variant: "destructive" });
      return;
    }

    setSteps(data || []);
  }, [toast]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  useEffect(() => {
    if (selectedWorkflow) {
      fetchSteps(selectedWorkflow.id);
    }
  }, [selectedWorkflow, fetchSteps]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);

      const newSteps = arrayMove(steps, oldIndex, newIndex);
      setSteps(newSteps);

      // Update order in database
      const updates = newSteps.map((step, index) => ({
        id: step.id,
        step_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("workflow_steps")
          .update({ step_order: update.step_order })
          .eq("id", update.id);
      }

      toast({ title: "Steps reordered", description: "Order saved successfully" });
    }
  };

  const addNewWorkflow = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("workflows")
      .insert({
        user_id: userId,
        name: "New Workflow",
        description: "Click to configure",
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to create workflow", variant: "destructive" });
    } else if (data) {
      setWorkflows((prev) => [data, ...prev]);
      setSelectedWorkflow(data);
      setSteps([]);
      toast({ title: "Workflow created", description: "Start adding steps" });
    }
    setSaving(false);
  };

  const deleteStep = async (stepId: string) => {
    const { error } = await supabase
      .from("workflow_steps")
      .delete()
      .eq("id", stepId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete step", variant: "destructive" });
    } else {
      setSteps((prev) => prev.filter((s) => s.id !== stepId));
      toast({ title: "Step deleted" });
    }
  };

  const addStep = async (stepOption: typeof triggerOptions[0] | typeof actionOptions[0]) => {
    if (!selectedWorkflow) return;

    const stepType = ["schedule", "webhook", "event"].includes(stepOption.type) ? "trigger" : "action";

    const { data, error } = await supabase
      .from("workflow_steps")
      .insert({
        workflow_id: selectedWorkflow.id,
        step_type: stepType,
        name: stepOption.name,
        icon_name: stepOption.icon,
        step_order: steps.length,
        config: {},
        status: "idle",
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to add step", variant: "destructive" });
    } else if (data) {
      setSteps((prev) => [...prev, data]);
      setShowAddStep(false);
      toast({ title: "Step added", description: `${stepOption.name} added` });
    }
  };

  const toggleWorkflowStatus = async (id: string) => {
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) return;

    const newStatus = workflow.status === "active" ? "paused" : "active";

    const { error } = await supabase
      .from("workflows")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
      );
      if (selectedWorkflow?.id === id) {
        setSelectedWorkflow((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
      toast({ title: "Status updated" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "paused": return "bg-amber-100 text-amber-700 border-amber-200";
      case "draft": return "bg-stone-100 text-stone-600 border-stone-200";
      default: return "bg-stone-100 text-stone-600 border-stone-200";
    }
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
      {/* Workflow List */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-4">
            <h3 className="font-display text-lg font-semibold text-stone-800">Workflows</h3>
            <Button 
              size="sm" 
              onClick={addNewWorkflow} 
              className="bg-stone-800 hover:bg-stone-700"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
              New
            </Button>
          </div>
          
          <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
            {workflows.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                <WorkflowIcon className="mx-auto mb-2 h-8 w-8 text-stone-300" />
                <p>No workflows yet</p>
                <p className="text-sm">Create your first workflow</p>
              </div>
            ) : (
              workflows.map((workflow) => (
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
                      <p className="mt-1 text-sm text-stone-500 line-clamp-1">{workflow.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-lg font-semibold text-stone-700">{workflow.success_rate}%</span>
                      <span className="text-xs text-stone-400">success</span>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="lg:col-span-2">
        {selectedWorkflow ? (
          <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 p-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-stone-800">{selectedWorkflow.name}</h3>
                <p className="text-sm text-stone-500">{steps.length} steps configured</p>
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
              </div>
            </div>

            <div className="p-6">
              {steps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-stone-100 p-4">
                    <WorkflowIcon className="h-8 w-8 text-stone-400" />
                  </div>
                  <h4 className="font-medium text-stone-700">No steps yet</h4>
                  <p className="mt-1 text-sm text-stone-500">Add a trigger to start</p>
                  <Button 
                    className="mt-4 bg-stone-800 hover:bg-stone-700"
                    onClick={() => setShowAddStep(true)}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add First Step
                  </Button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={steps.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <SortableStep
                          key={step.id}
                          step={step}
                          index={index}
                          totalSteps={steps.length}
                          onDelete={deleteStep}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {steps.length > 0 && (
                <motion.button
                  onClick={() => setShowAddStep(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-200 p-4 text-stone-500 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-600"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add Step</span>
                </motion.button>
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
                  
                  {steps.length === 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 text-sm font-medium text-stone-600">Triggers</h4>
                      <div className="grid gap-2">
                        {triggerOptions.map((option) => {
                          const Icon = iconMap[option.icon] || Zap;
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
                        const Icon = iconMap[option.icon] || Zap;
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
