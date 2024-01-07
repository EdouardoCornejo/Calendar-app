import { useDispatch, useSelector } from "react-redux";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
  onLogoutCalendar,
} from "../store";
import { calendarApi } from "../api";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await calendarApi.post("/auth", { email, password });

      if (data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("token-init-date", new Date().getTime());

        dispatch(onLogin({ name: data.name, uid: data.uid }));
      }
    } catch (error) {
      dispatch(onLogout(error.message));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 500);
    }
  };

  const startRegister = async ({ name, email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await calendarApi.post("/auth/register", {
        name,
        email,
        password,
      });

      if (data.status === "Success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("token-init-date", new Date().getTime());

        dispatch(onLogin({ name: data.name, uid: data.uid }));
      }
    } catch (error) {
      dispatch(
        onLogout(error.response.data?.msg || "Please contact administrator")
      );
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 500);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(onLogoutCalendar());
      dispatch(onLogout());
      return;
    }

    try {
      const { data } = await calendarApi.get("/auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogoutCalendar());
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    //Props
    status,
    user,
    errorMessage,

    //Methods
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout,
  };
};
