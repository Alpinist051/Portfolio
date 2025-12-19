-- Create workflows table
CREATE TABLE public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'New Workflow',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'draft')),
  success_rate NUMERIC DEFAULT 0,
  last_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create workflow_steps table
CREATE TABLE public.workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('trigger', 'action', 'condition', 'output')),
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Zap',
  config JSONB DEFAULT '{}',
  step_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'success', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create agents table
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'New Agent',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
  agent_type TEXT NOT NULL DEFAULT 'assistant' CHECK (agent_type IN ('assistant', 'analyst', 'executor', 'coordinator')),
  tools TEXT[] DEFAULT '{}',
  knowledge TEXT[] DEFAULT '{}',
  coordinates_with TEXT[] DEFAULT '{}',
  success_rate NUMERIC DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflows
CREATE POLICY "Users can view their own workflows" ON public.workflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workflows" ON public.workflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows" ON public.workflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows" ON public.workflows
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for workflow_steps (via workflow ownership)
CREATE POLICY "Users can view steps of their workflows" ON public.workflow_steps
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can create steps in their workflows" ON public.workflow_steps
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update steps in their workflows" ON public.workflow_steps
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete steps from their workflows" ON public.workflow_steps
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid())
  );

-- RLS Policies for agents
CREATE POLICY "Users can view their own agents" ON public.agents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents" ON public.agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" ON public.agents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" ON public.agents
  FOR DELETE USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();