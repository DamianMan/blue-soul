import React from "react";
import { FAB } from "react-native-paper";
import { StyleSheet } from "react-native";

function FabActivitiesItem({ url, name, bg, hanldePress }) {
  console.log(bg);
  return (
    <FAB
      key={url}
      label={name}
      animated={true}
      variant="surface"
      icon="eye"
      color="midnightblue"
      style={styles.fab}
      onPress={() => hanldePress(url)}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    margin: 8,
    backgroundColor: "lightblue",
  },
});

export default FabActivitiesItem;
