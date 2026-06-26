/* ═══════════════════════════════════════════════════════════
   DB.JS — Supabase Database Connection
   The Pickle-Metric Suite // Global Pickle Zine
═══════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'https://puvpullnnkykgvacemff.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dnB1bGxubmt5a2d2YWNlbWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTE2MTAsImV4cCI6MjA5MzgyNzYxMH0.atOYnNnjHu6C5tgvgOxyVMCmnVO0w_IyWYv3HXeLb38';

// Initialize the Supabase Client (gracefully handle missing CDN or bad URL)
try {
  if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn('Supabase init failed, using local storage only:', err);
}

// Helper function to track an "app unlock"
async function trackAppUnlock() {
  if (!window.supabaseClient) return;
  try {
    const { error } = await window.supabaseClient
      .from('user_stats')
      .insert([{ event_type: 'app_unlock', created_at: new Date() }]);
    if (error) console.warn("Could not track unlock:", error.message);
  } catch (err) {
    console.warn("DB unreachable:", err.message);
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
  if (window.supabaseClient) {
    try {
      const { error } = await window.supabaseClient
        .from('leaderboard')
        .insert([{ player_name: formattedName, score: score, created_at: new Date() }]);
      if (error) console.warn("Supabase save failed:", error.message);
    } catch (err) {
      console.warn("DB unreachable, saved locally:", err.message);
    }
  }
  return true;
}

// Helper function to fetch top 10 scores
async function fetchLeaderboard() {
  let remoteData = null;
  
  // 1. Try Supabase fetch
  if (window.supabaseClient) {
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
      console.warn("DB unreachable, using local scores:", err.message);
    }
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
    
    // Merge all remote and local scores, allow duplicates
    if (remoteData) {
      const merged = [...remoteData, ...localScores];
      merged.sort((a, b) => b.score - a.score);
      return merged.slice(0, 10);
    }

    return localScores.sort((a, b) => b.score - a.score).slice(0, 10);
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
