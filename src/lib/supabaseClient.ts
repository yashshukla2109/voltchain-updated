import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yswsrnormnpdvokmozlf.supabase.co"; // from your Supabase project
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzd3Nybm9ybW5wZHZva21vemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MzE5MDksImV4cCI6MjA3NjUwNzkwOX0.cjPqWSug02fQ_zcyy4S00MkrDzsXoTULEYxrtEPELsk"; // from Supabase API settings

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
