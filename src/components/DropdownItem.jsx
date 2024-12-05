import React, { memo } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { RadioButton } from "react-native-paper";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

function DropdownItem({ item }) {
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{item.label}</Text>
      {item.isOptional && (
        <View style={styles.radioView}>
          <Text style={{ color: "grey" }}>
            Option
            <MaterialCommunityIcons
              name="gesture-tap"
              size={24}
              color="dodgerblue"
            />
          </Text>
          <RadioButton
            value={item}
            status={checked ? "checked" : "unchecked"}
            color="dodgerblue"
            onPress={() => {
              setChecked((prev) => !prev);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
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
  radioView: {},
});
export default memo(DropdownItem);
