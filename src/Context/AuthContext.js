import React, { createContext, useState, useContext } from "react";
import axios from "axios";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  // Function getCookie extracted from the Django documentation

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const csrftoken = getCookie("csrftoken");

  // Authentication - Signup, Login, and Logout

  const signup = (username, password) => {
    return axios
      .post(`https://volunteer-land-server.herokuapp.com/api/newuser`, {
        username: username,
        password: password,
      })
      .then((response) => {
        return login(username, password);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  const login = (username, password) => {
    return axios
      .post(
        `https://volunteer-land-server.herokuapp.com/api/token/`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        retrieveCurrentUser();
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  const logout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setCurrentUser("");
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  };

  // Authorized request to be used throughout the application

  const authAxios = axios.create({
    baseURL: "https://volunteer-land-server.herokuapp.com/api/token/refresh/",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });

  // Request interceptor to always set the authorization header to the current access token

  authAxios.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "access_token"
      )}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to check token validity and refresh if needed

  authAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        return refreshAccessToken()
          .then(() => {
            return authAxios(error.config);
          })
          .catch((error) => {
            currentUser && logout();
            return Promise.reject(error);
          });
      }
      return Promise.reject(error);
    }
  );

  const refreshAccessToken = () => {
    return axios
      .post(
        `https://volunteer-land-server.herokuapp.com/api/token/refresh/`,
        {
          refresh: localStorage.getItem("refresh_token"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        localStorage.setItem("access_token", response.data.access);
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  // get current user information

  let retrieveCurrentUser = () => {
    return authAxios
      .get(`https://volunteer-land-server.herokuapp.com/api/currentuser`)
      .then((user) => {
        setCurrentUser(user.data[0]);
      })
      .catch((error) => {
        // user not logged in -> no action needed
      });
  };

  const value = {
    retrieveCurrentUser,
    currentUser,
    setCurrentUser,
    signup,
    login,
    authAxios,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
