import * as request from "./requester";

let baseUrl;

if (import.meta.env.VITE_API_URL) {
  baseUrl = `${import.meta.env.VITE_API_URL}/scores/`;
} else {
  const domain = window.location.origin;
  baseUrl = `${domain}/api/scores/`;
}

export const newScore = (scoreData) => request.post(baseUrl, scoreData);
