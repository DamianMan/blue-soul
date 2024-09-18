import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
function StudentModalInfo({ modalVisible, setModalVisible, data }) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={setModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={{ position: "absolute", right: 10, top: 5 }}
              onPress={setModalVisible}
            >
              <Text style={styles.textStyle}>
                <MaterialCommunityIcons
                  name="close-box"
                  size={24}
                  color="red"
                />
              </Text>
            </Pressable>
            <FlatList
              data={data}
              keyExtractor={(item) => item.tokenGroup + item.fullName}
              renderItem={(item) => {
                <View>
                  <Text style={styles.modalText}>{item.fullNAme}</Text>
                  <Text style={styles.modalText}>{item.email}</Text>
                  <Text style={styles.modalText}>{item.phone}</Text>
                  <Text style={styles.modalText}>{item.city}</Text>
                </View>;
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 55,
    shadowColor: "#000",
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
  },
});

export default StudentModalInfo;
