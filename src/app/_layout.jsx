import { Stack, Tabs } from "expo-router";
import LogoutBtn from "../components/LogoutBtn";
import PushNotificationBtn from "../components/PushNotificationBtn";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Login" }} />
      <Stack.Screen
        name="admin"
        options={{
          title: "Admin Panel",
          headerShown: true,
          headerStyle: {
            backgroundColor: "steelblue",
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
          headerShown: true,
          headerRight: () => <LogoutBtn />,
          headerStyle: {
            backgroundColor: "steelblue",
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
          headerShown: true,
          headerStyle: {
            backgroundColor: "steelblue",
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
          title: "Activities",
          headerShown: true,
          headerRight: () => <LogoutBtn />,
          headerStyle: {
            backgroundColor: "steelblue",
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
