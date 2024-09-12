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
        tabBarActiveTintColor: "#002379",
      }}
    >
      <Tabs.Screen
        name="homeUser"
        options={{
          title: "Home Page",
          tabBarStyle: { backgroundColor: "#FFFAE6" },
          headerStyle: {
            backgroundColor: "lightblue",
          },
          headerTitle: (props) => (
            <Image
              source={require("../../../assets/logo.png")}
              resizeMode="contain"
              style={{ width: 50, height: 50 }}
            />
          ),

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
            backgroundColor: "lightblue",
          },
          tabBarStyle: { backgroundColor: "#FFFAE6" },
          headerStyle: {
            backgroundColor: "lightblue",
          },
          headerTitle: (props) => (
            <Image
              source={require("../../../assets/logo.png")}
              resizeMode="contain"
              style={{ width: 50, height: 50 }}
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
