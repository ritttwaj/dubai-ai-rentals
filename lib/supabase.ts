import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sncapaqjtxvetqkhbaww.supabase.co'; // Get from Supabase project settings
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuY2FwYXFqdHh2ZXRxa2hiYXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMjg4OTQsImV4cCI6MjA4MzcwNDg5NH0.Y_kJ-SuWSJCWMYHea8ZWioQ1UW_zvqU5GMlDczPJiAM'; // Get from Supabase project settings

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});