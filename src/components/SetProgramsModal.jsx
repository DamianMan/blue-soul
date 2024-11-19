import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { Button } from "react-native-paper";

import SelectProgramItem from "./SelectProgramItem";

const { height, width } = Dimensions.get("window");

function SetProgramsModal({
  setModalVisible,
  modalVisible,
  startDate,
  endDate,
}) {
  // Get Days in Date Range
  const getDaysInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    if (start > end) return dates;

    while (start <= end) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    console.log(dates);
    return dates;
  };
  const [range, setRange] = useState(getDaysInRange(startDate, endDate));

  return (
    <Modal
      animationType="fade"
      presentationStyle="fullScreen"
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View>
          <Text style={styles.modalText}>
            <FlatList
              data={range}
              keyExtractor={(item) => item}
              renderItem={({ item }) => <SelectProgramItem item={item} />}
            />
          </Text>
        </View>
        <View style={styles.buttonsView}>
          <Button
            icon={"database"}
            buttonColor="#2185D5"
            textColor="aliceblue"
            mode="elevated"
            style={styles.button}
          >
            Save
          </Button>
          <Button
            icon={"close"}
            buttonColor="red"
            textColor="aliceblue"
            mode="elevated"
            style={styles.button}
            onPress={() => setModalVisible(!modalVisible)}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonsView: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
  },
  button: {
    margin: 15,
  },
});

export default SetProgramsModal;
