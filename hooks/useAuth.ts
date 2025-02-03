import { Authcontext } from "@/app/context/AuthContext";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { useContext } from "react";

const useAuth = () => {
  // User ka data global rakhna samaj, loading state sirf ek jagah rakni chaiye
  // Header
  const { data, error, loading, setAuthState } = useContext(Authcontext);
  //   Signin
  const signin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setAuthState({ loading: true, data: null, error: null });
    try {
      const res = await axios.post("https://localhost:3000/api/auth/signin", {
        email,
        password,
      });
      console.log(res);
      setAuthState({ loading: false, data: res.data, error: null });
    } catch (error: any) {
      // todo
      setAuthState({
        loading: false,
        data: null,
        error: error.response ? error.response.data.error : error.message,
      });
    }
  };

  //   Signup
  const signup = async ({
    email,
    password,
    firstName,
    lastName,
    city,
    phone,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
  }) => {
    try {
      // ;-)
      const res = await axios.post("https://localhost:3000/api/auth/signup", {
        email,
        password,
        firstName,
        lastName,
        city,
        phone,
      });
      console.log("Signup response:", res.data);
      setAuthState({ loading: false, data: res.data, error: null });
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response ? error.response.data.error : error.message,
      });
    }
  };

  //   Logout
  const logout = () => {
    deleteCookie("jwt");
    setAuthState({ loading: false, data: null, error: null });
  };
  return { signin, signup, logout };
};

export default useAuth;
