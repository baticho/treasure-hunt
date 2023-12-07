import * as request from "./requester";

const baseUrl = `${import.meta.env.VITE_API_URL || 'api'}/scores/`;

export const newScore = (scoreData) => request.post(baseUrl, scoreData);
