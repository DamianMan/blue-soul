import React from "react";
import { StyleSheet, Alert, View, Text, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";
import { useState } from "react";

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
  const [checked, setChecked] = useState(false);

  const itemPressed = () => {
    Alert.alert(item.title, item.description);
  };

  const handlePress = () => {
    setChecked((prev) => !prev);

    if (!checked) {
      setValue((prev) => [...prev, { ...item, isConfirmed: true }]);

      // newValue.push({ ...item, isConfirmed: true });
    } else {
      setValue((prev) => prev.filter((elem) => elem._id !== item._id));
      // newValue.filter((elem) => elem._id === item._id);
    }

    // console.log("EDITED VALUES:", newValue);
    // setValue(newValue);
  };

  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemTitleText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.title}</Text>
      </View>
      {!item.isConfirmed && item.isOptional && (
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

          <Text style={styles.itemRadioText}>Tap to confirm</Text>
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
