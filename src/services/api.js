import axios from 'axios';

const api = axios.create({
    baseURL: 'https://hrk-omnistack-backend.herokuapp.com',
    // baseURL: process.env.URL || 'http://localhost:3232'
});

export default api;