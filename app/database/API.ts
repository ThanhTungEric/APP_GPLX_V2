import axios from 'axios';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};

const { API_HOST, TOKEN_GET } = extra;

const API = axios.create({
  baseURL: API_HOST,
});

API.interceptors.request.use((config) => {
  config.headers['Authorization'] = TOKEN_GET;
  return config;
});

export default API;
