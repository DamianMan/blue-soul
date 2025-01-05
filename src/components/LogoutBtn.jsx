import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import auth from "@react-native-firebase/auth";
import { ContextData } from "../context/ContextDataProvider";
import { router } from "expo-router";
import Loader from "./Loader";

function LogoutBtn(props) {
  const [loading, setLoading] = useState(false);
  const signOut = async () => {
    try {
      setLoading(true);

      await auth().signOut();
      router.replace("/");
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleLogout = () => {
    signOut();
  };
  if (loading) {
    return <Loader />;
  }
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
