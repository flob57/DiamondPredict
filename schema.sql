CREATE TABLE IF NOT EXISTS user_state (
  id TEXT PRIMARY KEY,
  favorites_json TEXT NOT NULL DEFAULT '[]',
  predictions_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS user_bets_state (
  id TEXT PRIMARY KEY,
  bets_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL
);
