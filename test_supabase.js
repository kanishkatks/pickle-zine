const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://puvpullnnkykgvacemff.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8etMVTVEB0T6wjco8F9Usg_kPm-A1_q';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([{ player_name: 'TEST', score: 999, created_at: new Date() }]);
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
