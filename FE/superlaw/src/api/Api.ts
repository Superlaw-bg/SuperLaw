import axios from "axios";

const axiousClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

export default axiousClient;