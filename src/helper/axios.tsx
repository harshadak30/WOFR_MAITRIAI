import axios from "axios";

export default axios.create({
  baseURL:"http://13.203.16.246:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": true,
  },
});
