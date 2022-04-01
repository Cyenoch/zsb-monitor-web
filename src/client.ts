import Axios from 'axios';
const client = Axios.create({
  baseURL: import.meta.env.VITE_API_HOST ? import.meta.env.VITE_API_HOST : 'http://localhost:3002',
});
export default client;
