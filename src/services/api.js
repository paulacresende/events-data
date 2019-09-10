import axios from "axios";

const api = axios.create({
  baseURL: "https://storage.googleapis.com/dito-questions/"
});

export default api;