import axios from "axios";

const instance = axios.create({
  baseURL: "https://food-ordering-backend-5.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;