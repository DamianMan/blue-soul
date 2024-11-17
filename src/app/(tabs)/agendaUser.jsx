import React from "react";
import { View, Text } from "react-native";
import CalendarUser from "../../components/CalendarUser";

function agendaUser(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F3F3",
      }}
    >
      <CalendarUser />
    </View>
  );
}

export default agendaUser;
