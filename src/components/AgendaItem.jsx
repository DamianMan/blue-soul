import React from "react";
import { StyleSheet, Alert, View, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

function AgendaItem({ item }) {
  const itemPressed = () => {
    Alert.alert(item.title);
  };
  const buttonPressed = () => {
    Alert.alert("Show me more");
  };
  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemTitleText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.title}</Text>
      </View>
      <View style={styles.itemButtonContainer}>
        <Button
          mode="elevated"
          buttonColor={"#2185D5"}
          textColor="aliceblue"
          onPress={buttonPressed}
        >
          Info
        </Button>
      </View>
    </TouchableOpacity>
  );
}

export default AgendaItem;

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: "lightblue",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
    borderRadius: 5,
    marginVertical: 5,
  },
  itemHourText: {
    color: "black",
  },
  itemDurationText: {
    color: "#393E46",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: "black",
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  emptyItemText: {
    color: "lightgrey",
    fontSize: 14,
  },
});
