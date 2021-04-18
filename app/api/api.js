import axios from 'axios';

export default axios.create({
  baseURL: "https://dev.tuten.cl",
  headers: {'Content-type': 'application/json'}
});