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
  Workflow as WorkflowIcon, FlaskConical, Terminal, AlertCircle,
  Search, Filter, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  scheduled_cron: string | null;
  next_run: string | null;
  steps?: WorkflowStep[];
}

interface TestResult {
  stepId: string;
  status: "pending" | "running" | "success" | "error";
  message?: string;
  duration?: number;
}

interface TestLog {
  timestamp: string;
  stepName: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
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
  onDelete,
  testStatus
}: { 
  step: WorkflowStep; 
  index: number;
  totalSteps: number;
  onDelete: (id: string) => void;
  testStatus?: TestResult;
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

  const getStepStatusIcon = (status: string, testStat?: TestResult) => {
    // Prioritize test status if available
    if (testStat) {
      switch (testStat.status) {
        case "success": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        case "error": return <XCircle className="h-4 w-4 text-red-600" />;
        case "running": return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
        case "pending": return <div className="h-4 w-4 rounded-full border-2 border-dashed border-stone-300" />;
      }
    }
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
          {getStepStatusIcon(step.status, testStatus)}
          {index < totalSteps - 1 && (
            <div className="my-1 h-8 w-px bg-stone-200" />
          )}
        </div>

        <div className={`flex-1 rounded-lg border p-4 shadow-sm transition-all group-hover:shadow-md ${
          testStatus?.status === "running" ? "border-blue-300 bg-blue-50" :
          testStatus?.status === "success" ? "border-green-200 bg-green-50" :
          testStatus?.status === "error" ? "border-red-200 bg-red-50" :
          "border-stone-200 bg-white group-hover:border-stone-300"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                testStatus?.status === "running" ? "bg-blue-100" :
                testStatus?.status === "success" ? "bg-green-100" :
                testStatus?.status === "error" ? "bg-red-100" :
                "bg-stone-100"
              }`}>
                <StepIcon className={`h-5 w-5 ${
                  testStatus?.status === "running" ? "text-blue-600" :
                  testStatus?.status === "success" ? "text-green-600" :
                  testStatus?.status === "error" ? "text-red-600" :
                  "text-stone-600"
                }`} />
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  {step.step_type}
                </span>
                <h4 className="font-medium text-stone-800">{step.name}</h4>
                {testStatus?.duration && (
                  <span className="text-xs text-stone-500">{testStatus.duration}ms</span>
                )}
                {testStatus?.message && testStatus.status === "error" && (
                  <p className="text-xs text-red-600">{testStatus.message}</p>
                )}
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
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testLogs, setTestLogs] = useState<TestLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showSchedulePopover, setShowSchedulePopover] = useState(false);

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

    const typedData = (data || []) as Workflow[];
    setWorkflows(typedData);
    if (typedData.length > 0 && !selectedWorkflow) {
      setSelectedWorkflow(typedData[0]);
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

    setSteps((data || []) as WorkflowStep[]);
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
      const typedData = data as Workflow;
      setWorkflows((prev) => [typedData, ...prev]);
      setSelectedWorkflow(typedData);
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
      setSteps((prev) => [...prev, data as WorkflowStep]);
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

  // Add log helper
  const addLog = (stepName: string, type: TestLog["type"], message: string) => {
    setTestLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      stepName,
      type,
      message
    }]);
  };

  // Simulate workflow test execution
  const runWorkflowTest = async () => {
    if (!selectedWorkflow || steps.length === 0) return;
    
    setTesting(true);
    setShowLogs(true);
    setTestLogs([]);
    setTestResults(steps.map(s => ({ stepId: s.id, status: "pending" as const })));
    
    addLog("System", "info", `Starting workflow test: ${selectedWorkflow.name}`);
    addLog("System", "info", `Total steps: ${steps.length}`);
    
    // Simulate each step execution with realistic delays
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      addLog(step.name, "info", `Initializing step ${i + 1}/${steps.length}...`);
      
      // Update to running
      setTestResults(prev => 
        prev.map(r => r.stepId === step.id ? { ...r, status: "running" as const } : r)
      );
      
      addLog(step.name, "info", `Executing ${step.step_type}: ${step.name}`);
      
      // Simulate execution time (500-2000ms)
      const duration = Math.floor(Math.random() * 1500) + 500;
      await new Promise(resolve => setTimeout(resolve, duration));
      
      // 90% success rate simulation
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        addLog(step.name, "success", `Step completed in ${duration}ms`);
        addLog(step.name, "info", `Output: { "status": "ok", "data": {...} }`);
      } else {
        addLog(step.name, "error", `Step failed after ${duration}ms`);
        addLog(step.name, "error", `Error: Connection timeout - simulated failure`);
      }
      
      setTestResults(prev => 
        prev.map(r => r.stepId === step.id ? { 
          ...r, 
          status: isSuccess ? "success" as const : "error" as const,
          duration,
          message: isSuccess ? "Executed successfully" : "Simulated error for testing"
        } : r)
      );
      
      // If a step fails, stop the test
      if (!isSuccess) {
        addLog("System", "error", `Workflow test aborted due to step failure`);
        toast({ 
          title: "Test failed", 
          description: `Step "${step.name}" encountered an error`, 
          variant: "destructive" 
        });
        break;
      }
    }
    
    // Update workflow last_run timestamp
    await supabase
      .from("workflows")
      .update({ last_run: new Date().toISOString() })
      .eq("id", selectedWorkflow.id);
    
    const successCount = testResults.filter(r => r.status === "success").length;
    if (successCount === steps.length) {
      addLog("System", "success", `Workflow test completed successfully!`);
      toast({ title: "Test completed", description: "All steps executed successfully" });
    }
    
    setTesting(false);
  };

  // Delete workflow
  const deleteWorkflow = async (id: string) => {
    // First delete all steps
    await supabase.from("workflow_steps").delete().eq("workflow_id", id);
    
    // Then delete the workflow
    const { error } = await supabase.from("workflows").delete().eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: "Failed to delete workflow", variant: "destructive" });
    } else {
      setWorkflows(prev => prev.filter(w => w.id !== id));
      if (selectedWorkflow?.id === id) {
        setSelectedWorkflow(null);
        setSteps([]);
      }
      toast({ title: "Workflow deleted" });
    }
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  // Clone workflow with all steps
  const cloneWorkflow = async (workflow: Workflow) => {
    setSaving(true);
    
    // Create new workflow
    const { data: newWorkflow, error: workflowError } = await supabase
      .from("workflows")
      .insert({
        user_id: userId,
        name: `${workflow.name} (Copy)`,
        description: workflow.description,
        status: "draft",
        scheduled_cron: null,
      })
      .select()
      .single();

    if (workflowError || !newWorkflow) {
      toast({ title: "Error", description: "Failed to clone workflow", variant: "destructive" });
      setSaving(false);
      return;
    }

    // Clone all steps
    const { data: originalSteps } = await supabase
      .from("workflow_steps")
      .select("*")
      .eq("workflow_id", workflow.id)
      .order("step_order", { ascending: true });

    if (originalSteps && originalSteps.length > 0) {
      const newSteps = originalSteps.map(step => ({
        workflow_id: newWorkflow.id,
        step_type: step.step_type,
        name: step.name,
        icon_name: step.icon_name,
        config: step.config,
        step_order: step.step_order,
        status: "idle",
      }));

      await supabase.from("workflow_steps").insert(newSteps);
    }

    const typedWorkflow = newWorkflow as Workflow;
    setWorkflows(prev => [typedWorkflow, ...prev]);
    setSelectedWorkflow(typedWorkflow);
    toast({ title: "Workflow cloned", description: `Created "${typedWorkflow.name}"` });
    setSaving(false);
  };

  // Update workflow schedule
  const updateSchedule = async (cronExpression: string | null) => {
    if (!selectedWorkflow) return;

    const nextRun = cronExpression ? new Date(Date.now() + 60000).toISOString() : null;

    const { error } = await supabase
      .from("workflows")
      .update({ scheduled_cron: cronExpression, next_run: nextRun })
      .eq("id", selectedWorkflow.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update schedule", variant: "destructive" });
    } else {
      const updatedWorkflow = { ...selectedWorkflow, scheduled_cron: cronExpression, next_run: nextRun };
      setSelectedWorkflow(updatedWorkflow);
      setWorkflows(prev => prev.map(w => w.id === selectedWorkflow.id ? updatedWorkflow : w));
      toast({ title: cronExpression ? "Schedule set" : "Schedule cleared" });
    }
    setShowSchedulePopover(false);
  };

  // Filter workflows
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTestStatus = (stepId: string) => {
    return testResults.find(r => r.stepId === stepId);
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

          {/* Search and Filter */}
          <div className="border-b border-stone-100 p-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <Filter className="mr-2 h-4 w-4 text-stone-400" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
            {filteredWorkflows.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                <WorkflowIcon className="mx-auto mb-2 h-8 w-8 text-stone-300" />
                <p>{searchQuery || statusFilter !== "all" ? "No matching workflows" : "No workflows yet"}</p>
                <p className="text-sm">{searchQuery || statusFilter !== "all" ? "Try different filters" : "Create your first workflow"}</p>
              </div>
            ) : (
              filteredWorkflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  whileHover={{ backgroundColor: "rgb(250 250 249)" }}
                  className={`group relative w-full p-4 text-left transition-colors ${
                    selectedWorkflow?.id === workflow.id ? "bg-stone-50 border-l-4 border-l-stone-600" : ""
                  }`}
                >
                  <button
                    onClick={() => setSelectedWorkflow(workflow)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800">{workflow.name}</h4>
                        <p className="mt-1 text-sm text-stone-500 line-clamp-1">{workflow.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(workflow.status)}`}>
                            {workflow.status}
                          </span>
                          {workflow.scheduled_cron && (
                            <span className="flex items-center gap-1 text-xs text-blue-600">
                              <Calendar className="h-3 w-3" />
                              Scheduled
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-lg font-semibold text-stone-700">{workflow.success_rate}%</span>
                        <span className="text-xs text-stone-400">success</span>
                      </div>
                    </div>
                  </button>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-stone-400 hover:text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        cloneWorkflow(workflow);
                      }}
                      title="Clone workflow"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-stone-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkflowToDelete(workflow.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
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
                  onClick={runWorkflowTest}
                  disabled={testing || steps.length === 0}
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                >
                  {testing ? (
                    <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Testing...</>
                  ) : (
                    <><FlaskConical className="mr-1 h-4 w-4" /> Test Run</>
                  )}
                </Button>
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
                <Popover open={showSchedulePopover} onOpenChange={setShowSchedulePopover}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={selectedWorkflow.scheduled_cron ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                    >
                      <Calendar className="mr-1 h-4 w-4" />
                      {selectedWorkflow.scheduled_cron ? "Scheduled" : "Schedule"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64" align="end">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Schedule Workflow</h4>
                      <p className="text-xs text-stone-500">Select how often to run this workflow</p>
                      <div className="space-y-2">
                        <Button 
                          variant={selectedWorkflow.scheduled_cron === "*/5 * * * *" ? "default" : "outline"} 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => updateSchedule("*/5 * * * *")}
                        >
                          <Clock className="mr-2 h-4 w-4" /> Every 5 minutes
                        </Button>
                        <Button 
                          variant={selectedWorkflow.scheduled_cron === "0 * * * *" ? "default" : "outline"} 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => updateSchedule("0 * * * *")}
                        >
                          <Clock className="mr-2 h-4 w-4" /> Every hour
                        </Button>
                        <Button 
                          variant={selectedWorkflow.scheduled_cron === "0 0 * * *" ? "default" : "outline"} 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => updateSchedule("0 0 * * *")}
                        >
                          <Clock className="mr-2 h-4 w-4" /> Daily at midnight
                        </Button>
                        <Button 
                          variant={selectedWorkflow.scheduled_cron === "0 9 * * 1" ? "default" : "outline"} 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => updateSchedule("0 9 * * 1")}
                        >
                          <Clock className="mr-2 h-4 w-4" /> Weekly (Mon 9AM)
                        </Button>
                      </div>
                      {selectedWorkflow.scheduled_cron && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-red-600 hover:text-red-700"
                          onClick={() => updateSchedule(null)}
                        >
                          Clear Schedule
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => cloneWorkflow(selectedWorkflow)}
                  disabled={saving}
                >
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
                          testStatus={getTestStatus(step.id)}
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

              {/* Test Logs Panel */}
              {showLogs && testLogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 rounded-lg border border-stone-200 bg-stone-900 overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-stone-700 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-stone-200">Test Execution Logs</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLogs(false)}
                      className="h-6 text-stone-400 hover:text-stone-200"
                    >
                      Hide
                    </Button>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-3 font-mono text-xs">
                    {testLogs.map((log, index) => (
                      <div key={index} className="flex gap-2 py-0.5">
                        <span className="text-stone-500 shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`shrink-0 ${
                          log.type === "success" ? "text-emerald-400" :
                          log.type === "error" ? "text-red-400" :
                          log.type === "warning" ? "text-amber-400" :
                          "text-blue-400"
                        }`}>
                          [{log.stepName}]
                        </span>
                        <span className={
                          log.type === "success" ? "text-emerald-300" :
                          log.type === "error" ? "text-red-300" :
                          log.type === "warning" ? "text-amber-300" :
                          "text-stone-300"
                        }>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Workflow
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workflow? This action cannot be undone and will also delete all steps in this workflow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => workflowToDelete && deleteWorkflow(workflowToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkflowBuilder;
