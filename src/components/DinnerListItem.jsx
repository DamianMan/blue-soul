import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
function DinnerListItem({ item, data, handleUpdateDinner, type }) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Text>{item}</Text>
      <IconButton
        icon="close-circle-outline"
        iconColor="red"
        onPress={() => {
          const filteredItem = data.filter((elem) => elem !== item);
          handleUpdateDinner(type, filteredItem);
        }}
      />
    </View>
  );
}

export default DinnerListItem;
