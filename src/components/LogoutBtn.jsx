import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function LogoutBtn(props) {
  return (
    <Pressable
      style={{
        alignItems: "center",
        flexDirection: "row",
        paddingRight: 8,
      }}
      onPress={() => router.navigate("/")}
    >
      <Icon name={"logout"} size={20} color="red" />
      <Text style={{ color: "red" }}>Logout</Text>
    </Pressable>
  );
}

export default LogoutBtn;
