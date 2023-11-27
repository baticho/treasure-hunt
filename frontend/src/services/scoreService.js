import * as request from "./requester";

const baseUrl = `${import.meta.env.VITE_API_URL}/scores/`;

export const newScore = (scoreData) => request.post(scoreUrl, scoreData);
