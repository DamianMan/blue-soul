import { Redirect } from "expo-router";
import React from "react";

function HomeScreen(props) {
  return <Redirect href="/(tabs)/homeUser" />;
}

export default HomeScreen;
