import React from "react";
import { View, ActivityIndicator } from "react-native";

function Loader(props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={"dodgerblue"} size={"large"} />
    </View>
  );
}

export default Loader;
