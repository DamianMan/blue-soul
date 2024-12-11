import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const ContextData = createContext();

function ContextDataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isNotification, setIsNotfication] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("damaino");
  const [programs, setPrograms] = useState([]);

  const fetchData = () => {
    // Get Services

    getServices();
    // Get All Groups

    getGroups();
    // Get All Users

    getUsers();

    // Get Programs
    getPrograms();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get All Groups
  const getGroups = async () => {
    setLoading(true);

    try {
      await axios
        .get("https://blue-soul-app.onrender.com/api/getAllGroups")
        .then((res) => {
          setGroups(res.data);
          console.log("Render context GROUPS");
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error Responding All Groups:", err);
        });
    } catch (err) {
      console.log("Error Request:", err);
    }
  };
  // Get All Users

  const getUsers = async () => {
    setLoading(true);

    try {
      await axios
        .get("https://blue-soul-app.onrender.com/api/getUsers")
        .then((res) => {
          setUsers(res.data);
          console.log("Render context USERS");
          setLoading(false);
        })
        .catch((err) => console.log("Error Getting Response All Users:", err));
    } catch (error) {
      console.warn("Error in Request:", err.data);
    }
  };
  // Get Services
  const getServices = async () => {
    setLoading(true);

    try {
      await axios
        .get("https://blue-soul-app.onrender.com/api/getServices")
        .then((res) => {
          setServices(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error Responding Data:", err);
        });
    } catch (err) {
      console.log("Error Request:", err);
    }
  };

  // Get Programs
  const getPrograms = async () => {
    try {
      await axios
        .get("https://blue-soul-app.onrender.com/api/getPrograms")
        .then((res) => {
          console.log("Programs:", res.data);
          setPrograms(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error Responding Data:", err);
        });
    } catch (err) {
      console.log("Error Request:", err);
    }
  };

  // Set Notification Status
  const getNotificationStatus = (notif) => {
    setIsNotfication(notif);
  };

  // Add Item To Array
  const addItem = (setItem, item) => {
    setItem((prev) => [...prev, item !== "" && item]);
  };

  // Remove Item To Simple Array
  const removeItem = (setFunction, item) => {
    setFunction((prev) => prev.filter((i) => i !== item));
  };

  // Remove Item To Complex Array
  const removeItemComplexArray = (setState, state, id) => {
    const newArray = state.filter((item) => item._id !== id);

    setState(newArray);
  };

  // Set USER authenthication
  const addUserAuth = (user) => {
    setUser(user);
  };

  // Remove USR Auth
  const removeUserAuth = () => {
    setUser();
  };

  const appValues = {
    fetchData,
    user,
    addUserAuth,
    removeUserAuth,
    users,
    services,
    groups,
    programs,
    loading,
    getGroups,
    getUsers,
    getServices,
    getNotificationStatus,
    isNotification,
    addItem,
    removeItem,
    removeItemComplexArray,
  };
  return (
    <ContextData.Provider value={appValues}>{children}</ContextData.Provider>
  );
}

export { ContextDataProvider, ContextData };
