import React, { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import auth from "@react-native-firebase/auth";
import { ContextData } from "../context/ContextDataProvider";
import { router } from "expo-router";

function LogoutBtn(props) {
  const { removeUserAuth } = useContext(ContextData);
  const signOut = async () => {
    try {
      await auth().signOut();
      removeUserAuth();
      router.replace("/");
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
