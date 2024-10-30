import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const ContextData = createContext();

function ContextDataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isNotification, setIsNotfication] = useState(false);

  useEffect(() => {
    // Get Services

    getServices();
    // Get All Groups

    getGroups();
    // Get All Users

    getUsers();
  }, []);

  // Get All Groups
  const getGroups = async () => {
    try {
      await axios
        .get("http://192.168.1.59:3000/api/getAllGroups")
        .then((res) => {
          setGroups(res.data);
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
    try {
      await axios
        .get("http://192.168.1.59:3000/api/getUsers")
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => console.log("Error Getting Response All Users:", err));
    } catch (error) {
      console.warn("Error in Request:", err.data);
    }
  };
  // Get Services
  const getServices = async () => {
    try {
      await axios
        .get("http://192.168.1.59:3000/api/getServices")
        .then((res) => {
          setServices(res.data);
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

  const appValues = {
    users,
    services,
    groups,
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
