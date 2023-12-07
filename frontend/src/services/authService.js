import * as request from "./requester";

const baseUrl = `http://0.0.0.0:8040/api/accounts`;


export const login = (username, password) => 
    request.post(`${baseUrl}/login/`, { username, password });


export const logout = async (refresh) => {
    try {
        const response = await fetch(`${baseUrl}/logout/`, {
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
    request.post(`${baseUrl}/register/`, {username, email, first_name, last_name, password, password2});