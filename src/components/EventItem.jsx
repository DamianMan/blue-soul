import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Pressable,
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import { ContextData } from "../context/ContextDataProvider";
import { API_KEY_PROTECTED } from "@env";

const { width } = Dimensions.get("window");
function EventItem({ title, hour, id, description }) {
  const { fetchData } = useContext(ContextData);
  const handleDelete = async () => {
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/deleteEvent",
          {
            id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY_PROTECTED,
            },
          }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
          fetchData();
        })
        .catch((res) => Alert.alert(res.data.status, res.data.message));
    } catch (error) {
      alert("Error making request to delete event!");
    }
  };
  return (
    <Pressable
      onPress={() => Alert.alert(title, description)}
      style={styles.container}
    >
      <Text>{hour}</Text>
      <Text>{title}</Text>
      <Button
        icon={"delete-circle-outline"}
        textColor="red"
        onPress={handleDelete}
      ></Button>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "aliceblue",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginHorizontal: 10,
    width: (width * 90) / 100,
  },
});

export default EventItem;
