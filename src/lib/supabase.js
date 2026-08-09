import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bmaxcivzerwxaxdgextk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYXhjaXZ6ZXJ3eGF4ZGdleHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyOTQ0NTUsImV4cCI6MjEwMTg3MDQ1NX0.Ol3GxkFuaNmfFsAlAi4Fv1MiBR9OfqinYxVDsPv2MCU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
