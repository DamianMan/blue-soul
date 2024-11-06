import { Stack } from "expo-router";
import LogoutBtn from "../components/LogoutBtn";
import PushNotificationBtn from "../components/PushNotificationBtn";
import { useState, useEffect, useContext } from "react";
import auth from "@react-native-firebase/auth";
import { Redirect, router, useSegments } from "expo-router";
import { Image } from "react-native";
import {
  ContextData,
  ContextDataProvider,
} from "../context/ContextDataProvider";
import RootLayout from "./RootLayout";

export default function Main() {
  return (
    <ContextDataProvider>
      <RootLayout />
    </ContextDataProvider>
  );
}
