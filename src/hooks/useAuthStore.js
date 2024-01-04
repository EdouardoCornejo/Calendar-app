import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store";
import { useEffect, useState } from "react";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);

  const startLogin = async ({ email, password }) => {
    setIsError(false);
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
    }
  };

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 6000);

      return () => {
        clearTimeout();
      };
    }
  }, [isError]);

  return {
    //Props
    status,
    user,
    errorMessage,

    //Methods
    startLogin,
  };
};
