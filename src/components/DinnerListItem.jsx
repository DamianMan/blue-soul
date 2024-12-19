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
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        height: 35,
        marginLeft: 5,
        borderRadius: 12,
        padding: 5,
        backgroundColor: "lightseagreen",
      }}
    >
      <Text style={{ marginLeft: 15, color: "aliceblue" }}>{item}</Text>
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
