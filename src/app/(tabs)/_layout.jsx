import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, Pressable, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Logout from "../../components/LogoutBtn";
import LogoutBtn from "../../components/LogoutBtn";
import { BlurView } from "expo-blur";

import auth from "@react-native-firebase/auth";

export default function TabsLayout() {
  const user = auth().currentUser;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "grey",
      }}
    >
      <Tabs.Screen
        name="homeUser"
        options={{
          title: "Home Page",
          tabBarStyle: { backgroundColor: "aliceblue" },
          headerStyle: {
            backgroundColor: "aliceblue",
          },
          headerTitle: (props) => (
            <Image
              source={require("../../../assets/logo.png")}
              resizeMode="contain"
              style={{ width: 130, height: 130 }}
            />
          ),
          headerTitleAlign: "center", // Center the logo

          headerRight: () => <Logout />,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profileUser"
        options={{
          title: user?.displayName || "Profile",
          headerStyle: {
            backgroundColor: "aliceblue",
          },
          tabBarStyle: { backgroundColor: "aliceblue" },

          headerTitle: (props) => (
            <Image
              source={require("../../../assets/logo.png")}
              resizeMode="contain"
              style={{ width: 130, height: 130 }}
            />
          ),
          headerRight: () => <LogoutBtn />,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
