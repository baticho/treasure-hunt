import * as request from "./requester";

let baseUrl;

if (import.meta.env.VITE_API_URL) {
  baseUrl = `${import.meta.env.VITE_API_URL}/treasure-hunts`;
} else {
  const domain = window.location.origin;
  baseUrl = `${domain}/api/treasure-hunts`;
}

export const getAll = () => request.get(baseUrl);

export const getOne = (treasureHuntId) => request.get(`${baseUrl}${treasureHuntId}/`);

export const create = (treasureHuntData) => request.post(baseUrl, treasureHuntData);

export const edit = (treasureHuntId, treasureHuntData) => request.put(`${baseUrl}${treasureHuntId}/`, treasureHuntData);

export const remove = (treasureHuntId) => request.del(`${baseUrl}${treasureHuntId}/`);

