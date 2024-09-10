import React from "react";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
function PushNotificationBtn(props) {
  return (
    <Pressable
      style={{
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <AntDesign
        name="message1"
        size={20}
        color={"springgreen"}
        style={{ paddingRight: 5 }}
      />
      <Text style={{ color: "springgreen" }}>Push Msg</Text>
    </Pressable>
  );
}

export default PushNotificationBtn;
