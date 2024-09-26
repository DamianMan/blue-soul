import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const ContextData = createContext();

function ContextDataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [groups, setGroups] = useState([]);
  const [notification, setNotfication] = useState(false);

  useEffect(() => {
    // Get Services
    const getServices = async () => {
      try {
        await axios
          .get("http://localhost:3000/api/getServices")
          .then((res) => {
            setServices(res.data);
            console.log("Services loaded");
          })
          .catch((err) => {
            console.log("Error Responding Getting Services:", err.message);
          });
      } catch (err) {
        console.log("Error Request:", err);
      }
    };
    getServices();
    // Get All Groups
    const getGroups = async () => {
      try {
        await axios
          .get("http://localhost:3000/api/getAllGroups")
          .then((res) => {
            setGroups(res.data);
            console.log("Groups loaded");
          })
          .catch((err) => {
            console.log("Error Responding All Groups:", err);
          });
      } catch (err) {
        console.log("Error Request:", err);
      }
    };
    getGroups();
    // Get All Users

    const getUsers = async () => {
      try {
        await axios
          .get("http://localhost:3000/api/getUsers")
          .then((res) => {
            setUsers(res.data);
            console.log("User loaded");
          })
          .catch((err) =>
            console.log("Error Getting Response All Users:", err)
          );
      } catch (error) {
        console.warn("Error in Request:", err.data);
      }
    };
    getUsers();
  }, []);

  // Get All Groups
  const getGroups = async () => {
    try {
      await axios
        .get("http://localhost:3000/api/getAllGroups")
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
        .get("http://192.168.1.54:3000/api/getUsers")
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
        .get("http://192.168.1.54:3000/api/getServices")
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
    setNotfication(notif);
  };

  const appValues = {
    users,
    services,
    groups,
    getGroups,
    getUsers,
    getServices,
    getNotificationStatus,
    notification,
  };
  return (
    <ContextData.Provider value={appValues}>{children}</ContextData.Provider>
  );
}

export { ContextDataProvider, ContextData };
