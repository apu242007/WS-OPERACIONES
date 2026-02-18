
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fall back to provided demo keys
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://exgqsbvcyghrpmlawmaa.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Z3FzYnZjeWdocnBtbGF3bWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQzMjEsImV4cCI6MjA4NjI4MDMyMX0.KlwrEfx9X5zQChoX84vjDViS9icGjkjPu_3W1SGh22k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
