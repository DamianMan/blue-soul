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

export default function RootLayout() {
  const { user, addUserAuth } = useContext(ContextData);
  const segments = useSegments();
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  //   const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    addUserAuth(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(tabs)";
    if (user) {
      if (user.email === "admin@mail.com") {
        router.navigate("/admin");
      } else {
        router.navigate("/homeUser");
      }
    } else {
      router.navigate("/");
    }
  }, [user, initializing]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Login" }} />
      <Stack.Screen
        name="admin"
        options={{
          title: "Admin Panel",
          headerTitleAlign: "center",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#2185D5",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },

          headerRight: () => <LogoutBtn />,
          headerLeft: () => <PushNotificationBtn />,
        }}
      />
      <Stack.Screen
        name="homeUser"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="addNewGroup"
        options={{
          title: "Add Group",
          headerTitleAlign: "center",

          headerShown: true,
          headerRight: () => <LogoutBtn />,
          headerStyle: {
            backgroundColor: "#2185D5",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="checkEditGroup"
        options={{
          title: "Group",
          headerTitleAlign: "center",

          headerShown: true,
          headerStyle: {
            backgroundColor: "#2185D5",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => <LogoutBtn />,
        }}
      />
      <Stack.Screen
        name="editActivities"
        options={{
          title: "Services",
          headerTitleAlign: "center",

          headerShown: true,
          headerRight: () => <LogoutBtn />,
          headerStyle: {
            backgroundColor: "#2185D5",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="pushNotifications"
        options={{
          title: "Notifications",
          headerTitleAlign: "center",

          headerShown: true,
          headerRight: () => <LogoutBtn />,
          headerStyle: {
            backgroundColor: "#2185D5",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="profileUser"
        options={{
          title: "Profile User",
          headerRight: () => <LogoutBtn />,
        }}
      />
    </Stack>
  );
}
