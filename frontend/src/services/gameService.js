import * as request from "./requester";

let baseUrl;

if (import.meta.env.VITE_API_URL) {
  baseUrl = `${import.meta.env.VITE_API_URL}/games`;
} else {
  const domain = window.location.origin;
  baseUrl = `${domain}/api/games`;
}

export const fetchGame = (userId) => request.get(`${baseUrl}?user=${userId}`);
export const startGame = (gameData) => request.post(`${baseUrl}/`, gameData);
export const patchGame = (gameData, gameId) => request.patch(`${baseUrl}/${gameId}/`, gameData);
