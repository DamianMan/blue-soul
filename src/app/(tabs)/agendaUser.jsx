import React, { useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import CalendarUser from "../../components/CalendarUser";
import { ContextData } from "../../context/ContextDataProvider";

function agendaUser(props) {
  const { loading } = useContext(ContextData);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F3F3",
      }}
    >
      {loading ? (
        <ActivityIndicator color={"dodgerblue"} size={"large"} />
      ) : (
        <CalendarUser />
      )}
    </View>
  );
}

export default agendaUser;
