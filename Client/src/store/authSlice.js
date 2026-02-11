import { createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../api";
import { toast } from "react-toastify";

const STATUS = {
    IDLE: "idle",
    LOADING: "loading",
    ERROR: "error",
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: !!localStorage.getItem("token"),
        data: JSON.parse(localStorage.getItem("user")) || null,             
        loading: STATUS.IDLE,
        token: localStorage.getItem("token") || "",
        error: null
    },
    reducers:{
        setAuthenticated(state, action){
            state.isAuthenticated = action.payload;
        },

        setData(state, action){
            state.data = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
            state.isAuthenticated = true;
        },

      setLoading(state, action){
        state.loading = action.payload;
      },

      setError(state, action){
        state.error = action.payload;
      },

      setToken(state, action){
        state.token = action.payload;
      },

      logoutUser(state){
        state.isAuthenticated = false;
        state.data = null;
        state.token = "";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
      }
    }
})

export const { setAuthenticated, setData, setLoading, setError, setToken, logoutUser } = authSlice.actions;

export default authSlice.reducer;

export function registerUser(userData) {
    return async function registerUserThunk(dispatch) {
        dispatch(setLoading(STATUS.LOADING));

        if (!userData.userEmail || !userData.userPassword || !userData.username) {
            dispatch(setError("All fields are required"));
            dispatch(setLoading(STATUS.ERROR));
            toast.error("All fields are required");
            return { success: false };
        }

        try {
            const response = await apiClient.post("/auth/register", userData);

            if (response.status === 201) {
                dispatch(setLoading(STATUS.IDLE));
                toast.success(response.data?.message || "Registration successful! Please verify your email.");
                return { success: true };
            } else {
                dispatch(setError("Registration failed"));
                dispatch(setLoading(STATUS.ERROR));
                toast.error("Registration failed");
                return { success: false };
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Something went wrong";
            dispatch(setError(msg));
            dispatch(setLoading(STATUS.ERROR));
            toast.error(msg);
            return { success: false };
        }
    }
}

export function loginUser(userData) {
    return async function loginUserThunk(dispatch) {
        dispatch(setLoading(STATUS.LOADING));

        if (!userData.userEmail || !userData.userPassword) {
            dispatch(setError("Email and Password are required"));
            dispatch(setLoading(STATUS.ERROR));
            toast.error("Email and Password are required");
            return { success: false };
        }

        try {
            const response = await apiClient.post("/auth/login", userData);

            if (response.status === 200) {
                dispatch(setData(response.data.user));
                dispatch(setToken(response.data.token));
                dispatch(setAuthenticated(true));
                localStorage.setItem("token", response.data.token);
                dispatch(setLoading(STATUS.IDLE));
                toast.success("Login successful!");
                return { success: true, userRole: response.data.user.userRole };
            } else {
                dispatch(setError("Login failed"));
                dispatch(setLoading(STATUS.ERROR));
                toast.error("Login failed! Please check your credentials.");
                return { success: false };
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Something went wrong";
            dispatch(setError(msg));
            dispatch(setLoading(STATUS.ERROR));
            toast.error(msg);
            return { success: false };
        }
    }   
}
