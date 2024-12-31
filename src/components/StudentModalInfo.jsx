import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StudenInfoListItem from "./StudenInfoListItem";
import { IconButton } from "react-native-paper";
const { width, height } = Dimensions.get("window");
function StudentModalInfo({ modalVisible, setModalVisible, data }) {
  const closeModal = () => {
    setModalVisible();
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : height}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.centeredView}>
        <Modal
          animationType="slide"
          presentationStyle="fullScreen"
          visible={modalVisible}
          onRequestClose={setModalVisible}
        >
          <View style={styles.centeredView}>
            <IconButton
              style={{ position: "absolute", right: 0, top: 30 }}
              icon={"close"}
              iconColor="red"
              onPress={closeModal}
            />
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Info Student</Text>

              <StudenInfoListItem data={data} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "aliceblue",
  },
  modalView: {
    marginTop: 100,
    width,
    height,
    borderRadius: 20,
    padding: 45,
    marginVertical: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#2185D5",
    fontSize: 20,
  },
});

export default StudentModalInfo;
