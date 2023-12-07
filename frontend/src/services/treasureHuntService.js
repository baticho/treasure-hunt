import * as request from "./requester";

const baseUrl = `http://0.0.0.0:8040/api/treasure-hunts/`;

export const getAll = () => request.get(baseUrl);

export const getOne = (treasureHuntId) => request.get(`${baseUrl}${treasureHuntId}/`);

export const create = (treasureHuntData) => request.post(baseUrl, treasureHuntData);

export const edit = (treasureHuntId, treasureHuntData) => request.put(`${baseUrl}${treasureHuntId}/`, treasureHuntData);

export const remove = (treasureHuntId) => request.del(`${baseUrl}${treasureHuntId}/`);

