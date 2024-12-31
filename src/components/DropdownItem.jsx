import React, { memo } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { RadioButton } from "react-native-paper";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

function DropdownItem({ item, toggleOption, itemOptional }) {
  const [checked, setChecked] = useState(
    itemOptional.includes(item.value._id) || false
  );

  const handlePress = () => {
    console.log("DROPDOWN ITEM:", item);
    setChecked((prev) => !prev);
    toggleOption(!checked, item.value._id);
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>{item.label}</Text>
      </View>

      <View style={styles.radioView}>
        <Text style={{ color: "grey", fontSize: 10, alignItems: "center" }}>
          Option
          <MaterialCommunityIcons
            name={checked ? "check-decagram" : "progress-question"}
            size={16}
            color="dodgerblue"
            style={{ paddingLeft: 3 }}
          />
        </Text>
        <View style={styles.radioBtn}>
          <RadioButton
            value={item}
            status={checked ? "checked" : "unchecked"}
            color="dodgerblue"
            onPress={handlePress}
            uncheckedColor="grey"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 5,
    padding: 5,
    borderColor: "grey",
    borderRadius: 10,
    marginTop: 10,
  },
  text: {
    paddingHorizontal: 10,
  },
  radioView: {
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  radioBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    borderColor: "dodgerblue",
    borderWidth: 1, // Ensures the border is visible
  },
});
export default memo(DropdownItem);
