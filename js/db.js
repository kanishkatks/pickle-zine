/* ═══════════════════════════════════════════════════════════
   DB.JS — Supabase Database Connection
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'https://puvpullnnkykgvacemff.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8etMVTVEB0T6wjco8F9Usg_kPm-A1_q';

// Initialize the Supabase Client
// This requires the CDN script to be loaded in index.html first.
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to track an "app unlock"
async function trackAppUnlock() {
  try {
    const { error } = await window.supabaseClient
      .from('user_stats')
      .insert([{ event_type: 'app_unlock', created_at: new Date() }]);
    if (error) console.error("Could not track unlock:", error);
  } catch (err) {
    console.error("DB Error:", err);
  }
}

// Helper function to submit a score
async function submitScore(playerName, score) {
  try {
    const { error } = await window.supabaseClient
      .from('leaderboard')
      .insert([{ player_name: playerName.toUpperCase().substring(0,3), score: score, created_at: new Date() }]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Could not submit score:", err);
    return false;
  }
}

// Helper function to fetch top 10 scores
async function fetchLeaderboard() {
  try {
    const { data, error } = await window.supabaseClient
      .from('leaderboard')
      .select('player_name, score')
      .order('score', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Could not fetch leaderboard:", err);
    return [];
  }
}

window.db = {
  trackAppUnlock,
  submitScore,
  fetchLeaderboard
};
