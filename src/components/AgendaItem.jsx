import React, { memo } from "react";
import { StyleSheet, Alert, View, Text, TouchableOpacity } from "react-native";
import { Button, RadioButton } from "react-native-paper";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

function AgendaItem({
  item,
  setValue,
  value,
  items,
  date,
  setSelected,
  selected,
  saved,
}) {
  const [checked, setChecked] = useState(selected?.includes(item._id) || false);
  const [editedItem, setEditedItem] = useState(item);

  const itemPressed = () => {
    Alert.alert(item.title);
  };
  const buttonPressed = () => {
    Alert.alert("Show me more");
  };
  const handlePress = () => {
    console.log("First Edited Item:", editedItem);

    const newEditItem = {
      ...editedItem,
      isOptional: !editedItem.isOptional,
    };
    console.log("Second Edited Item:", newEditItem);

    setEditedItem(newEditItem);
    setSelected((prev) => {
      if (!checked) {
        return [...prev, item._id];
      } else {
        return prev.filter((elem) => elem === item._id);
      }
    });
    setChecked((prev) => !prev);

    const filteredChoiceArray = items[date].filter(
      (elem) => elem.isOptional === true
    );
    let newValue = [];
    let userChoiseElem = [];
    if (!checked) {
      userChoiseElem = filteredChoiceArray.find(
        (elem) => elem._id === item._id
      );
      console.log("userChoiseElem:", userChoiseElem);

      newValue.push({ ...userChoiseElem, isConfirmed: true });
    } else {
      newValue.filter((elem) => elem._id === item._id);
    }

    const filterNoChoice = items[date].filter(
      (elem) => elem.isOptional === false
    );

    filterNoChoice.length > 0 && newValue.push(filterNoChoice);
    console.log("EDITED VALUES:", newValue);
    setValue(newValue);
  };
  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemTitleText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.title}</Text>
      </View>
      {item.isConfirmed === false && (
        <View style={styles.itemButtonContainer}>
          <Text>{!checked ? "NOT JOINED" : "JOINED"}</Text>
          <View style={styles.radioBtn}>
            <RadioButton
              value={item}
              status={checked ? "checked" : "unchecked"}
              color="dodgerblue"
              onPress={handlePress}
            >
              Info
            </RadioButton>
          </View>

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
  radioBtn: {
    backgroundColor: "aliceblue",
    borderRadius: 50,
  },
});
