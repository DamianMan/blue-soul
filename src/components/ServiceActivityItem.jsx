import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";
import { ContextData } from "../context/ContextDataProvider";

function ServiceActivityItem({
  name,
  handleDelete,
  newActivity,
  food,
  drink,
  id,
  setFood,
  setDrinks,
  categoryName,
  setActivities,
}) {
  const { removeItem } = useContext(ContextData);
  const handleOnPress = () => {
    console.log("deleted");
    handleDelete(id, newActivity, food, drink);
    if (categoryName !== "Food & Drink") {
      removeItem(setActivities, name);
    } else {
      removeItem(food ? setFood : setDrinks, name);
    }
    // removeItem(setFoods, name);
    // removeItem(setDrinks, name);
  };
  return (
    <Button
      mode="elevated"
      buttonColor="orangered"
      textColor="#fff"
      elevation={3}
      style={styles.container}
      contentStyle={{ flexDirection: "row-reverse" }}
      icon={() => (
        <MaterialCommunityIcons
          name="delete-circle"
          size={24}
          color="#fff"
          style={{ marginLeft: 30 }}
          onPress={handleOnPress}
        />
      )}
    >
      {name}
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "lightseagreen",

    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#121481",
  },
});
export default ServiceActivityItem;
