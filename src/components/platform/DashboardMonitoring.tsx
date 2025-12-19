import { motion } from "framer-motion";
import { 
  Activity, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, Clock, Zap, Users, Workflow,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  status: "success" | "warning" | "error" | "neutral";
}

interface WorkflowStatus {
  id: string;
  name: string;
  status: "running" | "completed" | "failed" | "queued";
  progress: number;
  startTime: string;
  duration?: string;
}

interface Alert {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  timestamp: string;
  workflow: string;
}

const DashboardMonitoring = () => {
  const metrics: MetricCard[] = [
    {
      title: "Total Executions",
      value: "12,847",
      change: 12.5,
      changeLabel: "vs last week",
      icon: Zap,
      status: "success"
    },
    {
      title: "Success Rate",
      value: "97.3%",
      change: 2.1,
      changeLabel: "vs last week",
      icon: CheckCircle2,
      status: "success"
    },
    {
      title: "Avg. Duration",
      value: "2.4s",
      change: -15,
      changeLabel: "faster",
      icon: Clock,
      status: "success"
    },
    {
      title: "Active Agents",
      value: "8/12",
      change: 0,
      changeLabel: "no change",
      icon: Users,
      status: "neutral"
    }
  ];

  const recentWorkflows: WorkflowStatus[] = [
    { id: "1", name: "Lead Qualification", status: "running", progress: 67, startTime: "2 min ago" },
    { id: "2", name: "Daily Report", status: "completed", progress: 100, startTime: "5 min ago", duration: "1.2s" },
    { id: "3", name: "Content Approval", status: "completed", progress: 100, startTime: "8 min ago", duration: "3.4s" },
    { id: "4", name: "Email Campaign", status: "failed", progress: 45, startTime: "12 min ago" },
    { id: "5", name: "Data Sync", status: "queued", progress: 0, startTime: "Waiting" },
    { id: "6", name: "Customer Onboarding", status: "running", progress: 23, startTime: "1 min ago" },
  ];

  const alerts: Alert[] = [
    { id: "1", type: "error", message: "Email Campaign workflow failed: API rate limit exceeded", timestamp: "12 min ago", workflow: "Email Campaign" },
    { id: "2", type: "warning", message: "Report Generator agent response time increased by 40%", timestamp: "1 hour ago", workflow: "Daily Report" },
    { id: "3", type: "info", message: "New workflow 'Customer Onboarding' deployed successfully", timestamp: "2 hours ago", workflow: "Customer Onboarding" },
  ];

  const hourlyData = [
    { hour: "00:00", executions: 45, success: 44, failed: 1 },
    { hour: "04:00", executions: 23, success: 23, failed: 0 },
    { hour: "08:00", executions: 156, success: 152, failed: 4 },
    { hour: "12:00", executions: 234, success: 228, failed: 6 },
    { hour: "16:00", executions: 189, success: 185, failed: 4 },
    { hour: "20:00", executions: 87, success: 85, failed: 2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "failed": return "bg-red-100 text-red-700";
      case "queued": return "bg-stone-100 text-stone-600";
      default: return "bg-stone-100 text-stone-600";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error": return "border-red-200 bg-red-50 text-red-700";
      case "warning": return "border-amber-200 bg-amber-50 text-amber-700";
      case "info": return "border-blue-200 bg-blue-50 text-blue-700";
      default: return "border-stone-200 bg-stone-50 text-stone-700";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info": return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const maxExecutions = Math.max(...hourlyData.map(d => d.executions));

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          const isNeutral = metric.change === 0;
          
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                  <Icon className="h-5 w-5 text-stone-600" />
                </div>
                {!isNeutral && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}>
                    {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {Math.abs(metric.change)}%
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-stone-800">{metric.value}</p>
                <p className="text-sm text-stone-500">{metric.title}</p>
              </div>
              <p className="mt-2 text-xs text-stone-400">{metric.changeLabel}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-stone-800">Execution Activity</h3>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-1 h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-4 h-48">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full flex flex-col items-center">
                    <div 
                      className="w-full max-w-12 bg-green-200 rounded-t transition-all"
                      style={{ height: `${(data.success / maxExecutions) * 150}px` }}
                    />
                    {data.failed > 0 && (
                      <div 
                        className="w-full max-w-12 bg-red-300 rounded-t -mt-1"
                        style={{ height: `${(data.failed / maxExecutions) * 150}px` }}
                      />
                    )}
                  </div>
                  <span className="text-xs text-stone-500">{data.hour}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-200" />
                <span className="text-sm text-stone-500">Success</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-red-300" />
                <span className="text-sm text-stone-500">Failed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-stone-800">Alerts</h3>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                {alerts.filter(a => a.type === "error").length} critical
              </span>
            </div>
            
            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-lg border p-3 ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{alert.message}</p>
                      <p className="mt-1 text-xs opacity-70">{alert.timestamp}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workflows */}
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 p-4">
          <h3 className="font-display text-lg font-semibold text-stone-800">Recent Workflow Runs</h3>
        </div>
        
        <div className="divide-y divide-stone-100">
          {recentWorkflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 hover:bg-stone-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                  <Workflow className="h-5 w-5 text-stone-600" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-800">{workflow.name}</h4>
                  <p className="text-sm text-stone-500">Started {workflow.startTime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {workflow.status === "running" && (
                  <div className="w-32">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                      <motion.div 
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${workflow.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-stone-400 text-right">{workflow.progress}%</p>
                  </div>
                )}
                
                {workflow.duration && (
                  <span className="text-sm text-stone-500">{workflow.duration}</span>
                )}
                
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMonitoring;
