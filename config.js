import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://fabnhnzdwnbqnrorsmqe.supabase.co';
const supabaseKey = 'sb_publishable_hAbhY4sfhk4XYSMb9pFgiQ_XjY_QyDe';
const supabase = createClient(supabaseUrl, supabaseKey);

 export default supabase;
