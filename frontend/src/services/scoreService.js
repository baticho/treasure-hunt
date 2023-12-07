import * as request from "./requester";

const baseUrl = `http://0.0.0.0:8040/api/scores/`;

export const newScore = (scoreData) => request.post(baseUrl, scoreData);
