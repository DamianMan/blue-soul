import { Redirect } from "expo-router";
import React from "react";

const logout = () => {
  return <Redirect href={"/(tabs)/logout"} />;
};

export default logout;
