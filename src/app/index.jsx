import { Dimensions } from "react-native";

import { useContext, useEffect } from "react";
import { ContextData } from "../context/ContextDataProvider";
import HomeLoader from "../components/HomeLoader";
import SplashScreen from "react-native-splash-screen";

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const { loading } = useContext(ContextData);

  return <HomeLoader loading={loading} />;
}
