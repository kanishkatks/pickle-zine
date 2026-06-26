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
// Helper function to submit a score
async function submitScore(playerName, score) {
  const formattedName = playerName.toUpperCase().substring(0,3);
  
  // 1. Fallback save locally first to guarantee persistence
  try {
    const localScores = JSON.parse(localStorage.getItem('zine-leaderboard') || '[]');
    localScores.push({ player_name: formattedName, score: score, created_at: new Date() });
    localScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('zine-leaderboard', JSON.stringify(localScores.slice(0, 10)));
  } catch (err) {
    console.error("Local save error:", err);
  }

  // 2. Try Supabase save
  try {
    const { error } = await window.supabaseClient
      .from('leaderboard')
      .insert([{ player_name: formattedName, score: score, created_at: new Date() }]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Could not sync score to Supabase, saved locally:", err);
    return true; // return true because local save succeeded!
  }
}

// Helper function to fetch top 10 scores
async function fetchLeaderboard() {
  let remoteData = null;
  
  // 1. Try Supabase fetch
  try {
    const { data, error } = await window.supabaseClient
      .from('leaderboard')
      .select('player_name, score')
      .order('score', { ascending: false })
      .limit(10);
    
    if (!error && data && data.length > 0) {
      remoteData = data;
    }
  } catch (err) {
    console.warn("Could not fetch remote leaderboard, loading local scores:", err);
  }

  // 2. Fall back to local scores
  try {
    const localScores = JSON.parse(localStorage.getItem('zine-leaderboard') || '[]');
    if (localScores.length === 0) {
      // Seed interesting default zine high scores if empty
      const defaultSeeds = [
        { player_name: 'PKL', score: 1000 },
        { player_name: 'DIL', score: 850 },
        { player_name: 'VNG', score: 620 },
        { player_name: 'PIK', score: 450 },
        { player_name: 'SWR', score: 200 }
      ];
      localStorage.setItem('zine-leaderboard', JSON.stringify(defaultSeeds));
      return remoteData || defaultSeeds;
    }
    
    // Merge remote and local unique values if remote exists, otherwise return local
    if (remoteData) {
      const merged = [...remoteData, ...localScores];
      // remove duplicates by name
      const unique = [];
      const seen = new Set();
      for (const item of merged) {
        if (!seen.has(item.player_name)) {
          seen.add(item.player_name);
          unique.push(item);
        }
      }
      unique.sort((a, b) => b.score - a.score);
      return unique.slice(0, 10);
    }
    
    return localScores;
  } catch (err) {
    console.error("Leaderboard fallback failure:", err);
    return [];
  }
}

window.db = {
  trackAppUnlock,
  submitScore,
  fetchLeaderboard
};
