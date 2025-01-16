import React from "react";
import { ToggleButton, Badge } from "react-native-paper";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
function FoodDrinkListUserItem({
  name,
  type,
  storeUserPicks,
  deleteUserPicks,
}) {
  const [status, setStatus] = useState("unchecked");
  const onButtonToggle = (value) => {
    setStatus(status === "unchecked" ? "checked" : "unchecked");
    status === "unchecked" ? storeUserPicks(name) : deleteUserPicks(name);
  };
  return (
    <View
      style={{
        flexDirection: "column",
      }}
    >
      <Badge style={styles.badge} size={30}>
        {name}
      </Badge>
      <ToggleButton
        icon={type === "food" ? "silverware-fork-knife" : "bottle-soda"}
        value={name}
        status={status}
        onPress={onButtonToggle}
        size={50}
        accessibilityLabel={name}
        style={{
          marginHorizontal: 20,
          width: 60,
          height: 60,
          backgroundColor: `${
            status === "checked" ? "#AADFD7DB" : "transparent"
          }`,
          borderRadius: 10,
          padding: 5,
          margin: 3,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "aliceblue",
    paddingHorizontal: 10,
    color: "#000",
  },
});

export default FoodDrinkListUserItem;
