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
const { width, height } = Dimensions.get("window");
function StudentModalInfo({
  modalVisible,
  setModalVisible,
  data,
  toogleReload,
}) {
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
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Info Student</Text>
              <Pressable
                style={{ position: "absolute", right: 10, top: 5 }}
                onPress={() => {
                  setModalVisible();
                  toogleReload();
                }}
              >
                <Text style={styles.textStyle}>
                  <MaterialCommunityIcons
                    name="close-box"
                    size={24}
                    color="red"
                  />
                </Text>
              </Pressable>
              <StudenInfoListItem data={data} toogleReload={toogleReload} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginTop: height / 10,
    width: (width * 90) / 100,
    borderRadius: 20,
    padding: 45,
    marginVertical: 20,
    backgroundColor: "aliceblue",

    shadowColor: "blue",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    color: "orangered",
    fontSize: 20,
  },
});

export default StudentModalInfo;
