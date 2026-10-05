import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwrognqeiwlhkjwkdyeu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cm9nbnFlaXdsaGtqd2tkeWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTE2NDgsImV4cCI6MjA4OTMyNzY0OH0.TOQ5XjsCogwTuSHEOpmt275M9iqhtYIKT17n_Ne8_E0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
