import React, { memo } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { RadioButton } from "react-native-paper";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

function DropdownItem({ item }) {
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{item.label}</Text>
      {item.isOptional && (
        <RadioButton
          value={item}
          status={checked ? "checked" : "unchecked"}
          color="dodgerblue"
          onPress={() => {
            setChecked((prev) => !prev);
          }}
        >
          Info
        </RadioButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderColor: "grey",
    borderRadius: 10,
    marginTop: 10,
  },
  text: {
    paddingHorizontal: 10,
  },
});
export default memo(DropdownItem);
