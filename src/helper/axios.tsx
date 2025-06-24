import axios from "axios";

export default axios.create({
  // baseURL: "https://2f85-2401-4900-168f-3e60-897f-5d10-109d-88b4.ngrok-free.app/",
  // baseURL:"http://192.168.29.140:8080/",
  baseURL:"http://192.168.29.82:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": true,
  },
});
