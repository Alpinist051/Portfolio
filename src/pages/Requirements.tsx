import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FileText, Workflow, Bot, Link2, Database, Shield, Activity, TestTube, Settings } from "lucide-react";

const RequirementSection = ({ 
  icon: Icon, 
  title, 
  items, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  items: string[]; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="group rounded-xl border border-stone-200 border-l-4 border-l-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:border-l-stone-600 hover:bg-stone-50 hover:shadow-md"
  >
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
        <Icon className="h-5 w-5 text-stone-600" />
      </div>
      <h3 className="font-display text-lg font-semibold text-stone-800">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-stone-600">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-stone-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const Requirements = () => {
  const sections = [
    {
      icon: Workflow,
      title: "1. WORKFLOW SPECIFICATIONS",
      items: [
        "Business goal/objective",
        "Trigger event (schedule/webhook/manual)",
        "Input data sources/formats",
        "Processing steps with decision logic",
        "Success/failure conditions",
        "Output destinations/actions",
        "Required human approval points",
        "SLA/timeout requirements"
      ]
    },
    {
      icon: Bot,
      title: "2. AGENT DESCRIPTIONS",
      items: [
        "Primary function/purpose",
        "Allowed tools/APIs it can access",
        "Knowledge domain/limitations",
        "Required context/memory",
        "Coordination requirements (which agents it talks to)",
        "Success metrics for this agent",
        "Fallback procedures"
      ]
    },
    {
      icon: Link2,
      title: "3. INTEGRATION CONFIGURATIONS",
      items: [
        "API credentials/authentication method",
        "Rate limits and quotas",
        "Required scopes/permissions",
        "Data mapping (their fields → our schema)",
        "Webhook endpoints to create",
        "Error code handling specifics",
        "Pagination/query limits"
      ]
    },
    {
      icon: Database,
      title: "4. DATA SCHEMAS",
      items: [
        "Customer/contact data structure",
        "Product/catalog schema",
        "Campaign/creative metadata",
        "Attribution event model",
        "Performance metrics definitions",
        "Executive report formats",
        "Audit log requirements"
      ]
    },
    {
      icon: Shield,
      title: "5. BUSINESS RULES",
      items: [
        "Content approval workflows",
        "Budget/spend limits per channel",
        "Escalation paths for failures",
        "Compliance/regulatory rules",
        "Brand voice/guidelines for AI",
        "Privacy/data handling policies",
        "ROI calculation formulas"
      ]
    },
    {
      icon: Activity,
      title: "6. MONITORING REQUIREMENTS",
      items: [
        "Critical metrics to track per workflow",
        "Alert thresholds (error rates, latency)",
        "Dashboard visualization needs",
        "Report schedules (real-time/daily/weekly)",
        "User roles/access for monitoring",
        "SLA definitions per workflow type"
      ]
    },
    {
      icon: TestTube,
      title: "7. TESTING SCENARIOS",
      items: [
        "Happy path for each workflow",
        "Common failure cases",
        "Edge cases to validate",
        "Load/volume test parameters",
        "Integration failure simulations",
        "Data quality test cases"
      ]
    },
    {
      icon: Settings,
      title: "8. ENVIRONMENT SETTINGS",
      items: [
        "Development vs production configurations",
        "API keys per environment",
        "Feature flags needed",
        "Rate limiting configurations",
        "Backup/retry policies",
        "Data retention periods",
        "Archiving rules"
      ]
    }
  ];

  const formatItems = [
    { format: "Excel/CSV", usage: "Workflow specifications" },
    { format: "JSON/YAML", usage: "Data schemas" },
    { format: "Markdown", usage: "Business rules" },
    { format: "Mermaid/Flowchart", usage: "Complex workflows" },
    { format: "API Documentation", usage: "Integrations" },
    { format: "Spreadsheet", usage: "Test cases" }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pb-20 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm">
            <FileText className="h-4 w-4" />
            <span>Documentation</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-stone-800 md:text-5xl">
            Requirements Specification
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-stone-600">
            Comprehensive documentation for workflow specifications, agent descriptions, 
            integrations, and system configurations.
          </p>
        </motion.div>

        {/* Requirement Sections Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2">
          {sections.map((section, index) => (
            <RequirementSection
              key={section.title}
              icon={section.icon}
              title={section.title}
              items={section.items}
              delay={0.1 + index * 0.05}
            />
          ))}
        </div>

        {/* Format for Submission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12 rounded-xl border border-stone-200 bg-white p-8 shadow-sm"
        >
          <h2 className="mb-6 font-display text-2xl font-semibold text-stone-800">
            FORMAT FOR SUBMISSION
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formatItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg bg-stone-50 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-200 font-display text-sm font-semibold text-stone-600">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-stone-800">{item.format}</p>
                  <p className="text-sm text-stone-500">{item.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Critical Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12 rounded-xl border border-amber-200 bg-amber-50 p-8"
        >
          <h2 className="mb-4 font-display text-xl font-semibold text-amber-800">
            CRITICAL NOTES
          </h2>
          <ul className="space-y-2 text-amber-700">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              Start with 5 highest-priority workflows first
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              Include real sample data for testing
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              Document decision logic explicitly (if/then/else)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              Specify data transformation requirements
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              Define ownership/responsibility for each workflow
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              Note seasonal variations or special cases
            </li>
          </ul>
        </motion.div>

        {/* Pro Tip Template */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-xl border border-stone-200 bg-stone-800 p-8 text-white"
        >
          <h2 className="mb-4 font-display text-xl font-semibold text-stone-100">
            PRO TIP: Workflow Template
          </h2>
          <div className="rounded-lg bg-stone-900 p-6 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-stone-300">
{`Workflow Name: [Name]
Trigger: [When does it start?]
Input: [What data enters?]
Steps:
  1. [Agent/Tool] → [Action] → [Output]
  2. [Next step]...
Success: [Final outcome]
Failure: [What happens if it breaks?]
Monitoring: [What to track?]`}
            </pre>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Requirements;
