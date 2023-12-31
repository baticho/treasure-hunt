const request = async (method, url, data) => {
    try {
        const user = localStorage.getItem('auth');
        const auth = JSON.parse(user || '{}');

        let headers = {}

        if (auth.access) {
            headers['Authorization'] = `Bearer ${auth.access}`;
        }
        let buildRequest;

        if (method === 'GET') {
            buildRequest = fetch(url, { headers });
        } else {
            buildRequest = fetch(url, {
                method,
                headers: {
                    ...headers,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(data)
            });
        }
        const response = await buildRequest;


        if (response.ok) {
            if (response.status === 204) {
                return null;
            }
            const result = await response.json();
            return result;
        } else {
            const errorResponse = await response.json();
            throw new Error(`${JSON.stringify(errorResponse)}`);
        }
    } catch (error) {
        throw error;
    }
};

export const get = request.bind({}, 'GET');
export const post = request.bind({}, 'POST');
export const patch = request.bind({}, 'PATCH');
export const put = request.bind({}, 'PUT');
export const del = request.bind({}, 'DELETE');