-- Add scheduled_cron column to workflows table for scheduling
ALTER TABLE public.workflows 
ADD COLUMN scheduled_cron text DEFAULT NULL,
ADD COLUMN next_run timestamp with time zone DEFAULT NULL;