import axios from 'axios';
import { apiBaseUrl } from '@/config/app.config';

const imgApi = axios.create({
  baseURL: apiBaseUrl
});

export default imgApi;
