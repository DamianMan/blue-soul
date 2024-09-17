import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const ContextData = createContext();

function ContextDataProvider({ children }) {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const getStudents = async () => {
      try {
        await axios
          .get("http://localhost:3000/api/getStudents")
          .then((res) => {
            setStudents(res.data);
          })
          .catch((err) => console.log("Error In Response:", err));
      } catch (error) {
        console.warn("Error in Request:", err.data);
      }
    };
    getStudents();
  }, []);

  const appValues = { students };
  return (
    <ContextData.Provider value={appValues}>{children}</ContextData.Provider>
  );
}

export { ContextDataProvider, ContextData };
