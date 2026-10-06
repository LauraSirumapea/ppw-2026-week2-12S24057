/**
 * api-service.js
 * Data Access Layer
 *
 * Bertugas mengelola seluruh komunikasi data aplikasi.
 * Presentation Layer (app.js) tidak mengakses sumber data
 * secara langsung.
 */

const ApiService = (() => {
    const BASE_URL = 'data/';

    // Mock REST API untuk simulasi HTTP POST
    const REST_API_URL = 'https://jsonplaceholder.typicode.com/posts';

    async function fetchJSON(fileName) {
        const response = await fetch(BASE_URL + fileName);

        if (!response.ok) {
            throw new Error(
                `HTTP Error ${response.status}: ${response.statusText}`
            );
        }

        return response.json();
    }

    async function postServiceOrder(payload) {
        const response = await fetch(REST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(
                `POST Error ${response.status}: ${response.statusText}`
            );
        }

        return response.json();
    }

    return {
        fetchProfile: () => fetchJSON('profile.json'),
        fetchProjects: () => fetchJSON('projects.json'),
        fetchServices: () => fetchJSON('services.json'),
        submitServiceOrder: (payload) => postServiceOrder(payload)
    };
})();