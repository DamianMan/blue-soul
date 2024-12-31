import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, Pressable } from "react-native";
import { Chip, IconButton } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StudentModalInfo from "./StudentModalInfo";
const { width } = Dimensions.get("window");

function StudentChipItem({ data }) {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
      }}
    >
      <Pressable onPress={toggleModal} style={styles.chip}>
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons
            name="account"
            size={24}
            color="#3FA2F6"
            style={{ marginRight: 10 }}
          />

          <Text style={styles.chipText}>{data.fullName}</Text>
        </View>
        <View>
          <IconButton
            icon={() => (
              <MaterialCommunityIcons
                name="information"
                size={24}
                color="#3FA2F6"
                style={{ alignSelf: "flex-end" }}
              />
            )}
          />
        </View>
      </Pressable>
      <StudentModalInfo
        modalVisible={modalVisible}
        setModalVisible={toggleModal}
        data={data}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  chip: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: (width * 65) / 100,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "#3FA2F6",
    backgroundColor: "#fff",
    color: "#3FA2F6",
    borderColor: "#3FA2F6",
    shadowColor: "#3FA2F6",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.52,
    shadowRadius: 4.22,

    elevation: 6,
  },
  chipText: {
    color: "#3FA2F6",
    fontSize: 16,
  },
});

export default StudentChipItem;
