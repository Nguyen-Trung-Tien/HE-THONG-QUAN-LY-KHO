import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";

const getPreloadedState = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      // Ensure state.user has all fields AND currentUser is set to the same data
      return {
        user: {
          ...userData,
          currentUser: userData
        }
      };
    }
  } catch (e) {
    console.error("Failed to load preloaded state", e);
  }
  return undefined;
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: getPreloadedState(),
});

export default store;
