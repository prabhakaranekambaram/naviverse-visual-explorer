// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hzlpnietjiupwwrpgzfy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bHBuaWV0aml1cHd3cnBnemZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NDQ2OTksImV4cCI6MjA1MTEyMDY5OX0.NKBg1r4ULW_aRykv7oqAKqg6ng5KEhSJ-bLNcDvz4yk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);