/**
 * RAWG API Configuration
 * Note: In production, this should be moved to environment variables
 * for better security practices
 */
export const API_KEY = "84b20635bb8548759d4ea7a1af1d39e4";

/**
 * Base URLs for different API endpoints
 */
export const API_BASE_URL = "https://api.rawg.io/api";
export const GAMES_ENDPOINT = `${API_BASE_URL}/games`;
export const STORES_ENDPOINT = (gameId) => `${API_BASE_URL}/games/${gameId}/stores`;
