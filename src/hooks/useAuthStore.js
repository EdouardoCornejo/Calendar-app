import { useDispatch, useSelector } from "react-redux";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store";
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

  return {
    //Props
    status,
    user,
    errorMessage,

    //Methods
    startLogin,
  };
};
