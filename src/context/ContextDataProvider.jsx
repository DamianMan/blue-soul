import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const ContextData = createContext();

function ContextDataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        // Get Users
        await axios
          .get("http://localhost:3000/api/getUsers")
          .then((res) => {
            setUsers(res.data);
          })
          .catch((err) => console.log("Error In Response:", err));
      } catch (error) {
        console.warn("Error in Request:", err.data);
      }
    };
    getUsers();

    // Get Services
    const getServices = async () => {
      try {
        await axios
          .get("http://localhost:3000/api/getServices")
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
    getServices();

    // Get All Groups
    const getGroups = async () => {
      try {
        await axios
          .get("http://localhost:3000/api/getAllGroups")
          .then((res) => {
            setGroups(res.data);
          })
          .catch((err) => {
            console.log("Error Responding Data:", err);
          });
      } catch (err) {
        console.log("Error Request:", err);
      }
    };
    getGroups();
  }, []);

  const appValues = { users, services, groups };
  return (
    <ContextData.Provider value={appValues}>{children}</ContextData.Provider>
  );
}

export { ContextDataProvider, ContextData };
