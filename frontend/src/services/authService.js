import * as request from "./requester";

let baseUrl;

if (import.meta.env.VITE_API_URL) {
  baseUrl = `${import.meta.env.VITE_API_URL}/accounts/`;
} else {
  const domain = window.location.origin;
  baseUrl = `${domain}/api/accounts/`;
}

export const login = (username, password) => 
    request.post(`${baseUrl}login/`, { username, password });


export const logout = async (refresh) => {
    try {
        const response = await fetch(`${baseUrl}logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': `application/json`
            },
            body: JSON.stringify({
                'refresh': refresh
            })
        });

        return response;
    } catch (error) {
        console.log(error);
    }
};

export const register = (username, email, first_name, last_name, password, password2) =>
    request.post(`${baseUrl}register/`, {username, email, first_name, last_name, password, password2});