// Time (ms) when fetch request will timeout
export const FETCH_TIMEOUT = 30000;

// IndexedDB database name
export const DATABASE_NAME = "primero";

// Type of records available
export const RECORD_TYPES = ["cases", "incidents", "tracing_requests"];

// Time (ms) when the idle dialog will activate when a user is inactive
export const IDLE_TIMEOUT = 15 * 1000 * 60;

// Time (ms) user has to respond to idle dialog before logged out
export const IDLE_LOGOUT_TIMEOUT = 5 * 1000 * 60;

// Time (ms) how often the backend is pinged to refresh the user's token
export const TOKEN_REFRESH_INTERVAL = 30 * 1000 * 60;
