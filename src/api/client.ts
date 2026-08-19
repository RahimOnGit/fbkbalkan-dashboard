import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // your Spring Boot default port
    headers: {
        'Content-Type': 'application/json',
    },
});