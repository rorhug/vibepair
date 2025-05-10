import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const NEXT_PUBLIC_SUPABASE_URL = "https://mxwpkboxefgwnvsmhaia.supabase.co";
const NEXT_PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14d3BrYm94ZWZnd252c21oYWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzQ2MDEsImV4cCI6MjA2MjQ1MDYwMX0.bmNAaR6Q2EjCkc5wKdu-eqZK06Bnds1yapvsLZhAtWM";

const supabase = createClient<Database>(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default supabase;
