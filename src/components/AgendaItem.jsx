import React, { memo } from "react";
import { StyleSheet, Alert, View, Text, TouchableOpacity } from "react-native";
import { Button, RadioButton } from "react-native-paper";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

function AgendaItem({ item, setValue, value }) {
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState();
  const [editedItem, setEditedItem] = useState(item);

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
      {item.isOptional && (
        <View style={styles.itemButtonContainer}>
          <Text>{!checked ? "NOT JOINED" : "JOINED"}</Text>
          <RadioButton
            value={item}
            status={checked ? "checked" : "unchecked"}
            color="dodgerblue"
            onPress={() => {
              console.warn("First Edited Item:", editedItem);

              const newEditItem = {
                ...editedItem,
                isOptional: !editedItem.isOptional,
              };
              console.log("Second Edited Item:", newEditItem);

              setEditedItem(newEditItem);

              setChecked((prev) => !prev);

              setValue((prev) =>
                !checked
                  ? [...prev, newEditItem]
                  : prev.filter((elem) => elem.id !== item.id)
              );
            }}
          >
            Info
          </RadioButton>
          <Text style={styles.itemRadioText}>
            Tap to confirm or leave blank to denie your presence.
          </Text>
        </View>
      )}
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
  itemRadioText: {
    fontSize: 10,
    paddingLeft: 30,
    color: "grey",
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
    justifyContent: "flex-end",
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
