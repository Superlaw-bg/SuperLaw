import axios from "axios";
import store from "../store/store";

export const setAuthHeader = () => {
  const token = store.getState().auth.user.token;
  
  return {
      headers: {
          'Authorization': `Bearer ${token}`,
      }
  }
}

export default axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});