import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import auth from "@react-native-firebase/auth";

function LogoutBtn(props) {
  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      alert(error);
    }
  };

  const handleLogout = () => {
    signOut();
  };
  return (
    <Pressable
      style={{
        alignItems: "center",
        flexDirection: "row",
        paddingRight: 8,
      }}
      onPress={handleLogout}
    >
      <Icon name={"logout"} size={20} color="red" />
      <Text style={{ color: "red" }}>Logout</Text>
    </Pressable>
  );
}

export default LogoutBtn;
