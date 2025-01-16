import { Stack } from "expo-router";
import LogoutBtn from "../components/LogoutBtn";
import PushNotificationBtn from "../components/PushNotificationBtn";
import { useState, useEffect, useContext } from "react";
import auth from "@react-native-firebase/auth";
import { Redirect, router, useSegments } from "expo-router";
import Loader from "../components/Loader";

export default function RootLayout() {
  const segments = useSegments();
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    console.log("USER AUTHENTICATED:", user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(tabs)";
    console.log("IN AUTH GROUP:", inAuthGroup);
    if (user && !inAuthGroup) {
      if (user.email === "admin@mail.com" || user.email === "staff@mail.com") {
        router.replace("/admin");
      } else {
        router.replace("/homeUser");
      }
    }
    // else if (!user && inAuthGroup) {
    //   router.replace("/");
    // } else if (!user && !inAuthGroup) {
    //   console.log("No user No AUTH group");
    //   router.replace("/");
    // }
  }, [user, initializing]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />

      <Stack.Screen
        name="admin"
        options={{
          title: "Admin Panel",
          headerTitleAlign: "center",
          headerShown: true,
          headerStyle: {
            backgroundColor: "aliceblue",
          },
          headerTintColor: "#303841",
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
            backgroundColor: "aliceblue",
          },
          headerTintColor: "#303841",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="events"
        options={{
          title: "Add Event",
          headerTitleAlign: "center",

          headerShown: true,
          headerRight: () => <LogoutBtn />,
          headerStyle: {
            backgroundColor: "aliceblue",
          },
          headerTintColor: "#303841",
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
            backgroundColor: "aliceblue",
          },
          headerTintColor: "#303841",
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
            backgroundColor: "aliceblue",
          },
          headerTintColor: "#303841",
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
            backgroundColor: "aliceblue",
          },
          headerTintColor: "#303841",
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
      <Stack.Screen
        name="agendaUser"
        options={{
          title: "Agenda User",
          headerRight: () => <LogoutBtn />,
        }}
      />
    </Stack>
  );
}
