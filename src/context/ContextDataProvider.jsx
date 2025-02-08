import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import auth from "@react-native-firebase/auth";
import { API_KEY_PROTECTED } from "@env";

const ContextData = createContext();

function ContextDataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isNotification, setIsNotfication] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("damaino");
  const [programs, setPrograms] = useState([]);

  const fetchData = async () => {
    // Get Services

    await getServices();
    // Get All Groups

    await getGroups();
    // Get All Users

    await getUsers();

    // Get Programs
    await getPrograms();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get All Groups
  const getGroups = async () => {
    setLoading(true);

    try {
      await axios
        .get("https://blue-soul-app.onrender.com/api/getAllGroups", {
          headers: { "x-api-key": API_KEY_PROTECTED },
        })
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
        .get("https://blue-soul-app.onrender.com/api/getUsers", {
          headers: { "x-api-key": API_KEY_PROTECTED },
        })
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
        .get("https://blue-soul-app.onrender.com/api/getServices", {
          headers: { "x-api-key": API_KEY_PROTECTED },
        })
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

  // Sort Discendent

  const sortedArray = (array) => {
    array.sort((a, b) => {
      const [hoursA, minutesA] = a.hour.split(":").map(Number);
      const [hoursB, minutesB] = b.hour.split(":").map(Number);

      const floatA = hoursA + minutesA / 60;
      const floatB = hoursB + minutesB / 60;

      return floatA - floatB; // Ascending order
    });
    return array;
  };
  // Get Programs
  const getPrograms = async () => {
    try {
      await axios
        .get("https://blue-soul-app.onrender.com/api/getPrograms", {
          headers: { "x-api-key": API_KEY_PROTECTED },
        })
        .then((res) => {
          setPrograms(sortedArray(res.data));
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

  // Remove USR Auth
  const removeUserAuth = () => {
    setUser();
  };

  const appValues = {
    fetchData,
    user,
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
    sortedArray,
  };
  return (
    <ContextData.Provider value={appValues}>{children}</ContextData.Provider>
  );
}

export { ContextDataProvider, ContextData };
