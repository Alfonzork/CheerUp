import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ismbfkmhfvhuiavsqfzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbWJma21oZnZodWlhdnNxZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MzY1NTIsImV4cCI6MjA1OTMxMjU1Mn0.OoUNlTs0YgDzDlidzXBMED5QqMQ8Fu474LVtLZvh_vM';

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Las credenciales de Supabase no están configuradas correctamente.');
  }
  
  export const supabase = createClient(supabaseUrl, supabaseKey);
  
  export const SUPABASE_STORAGE_URL = 'https://ismbfkmhfvhuiavsqfzy.supabase.co/storage/v1/object/public'; 