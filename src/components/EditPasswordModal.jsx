import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, Dimensions } from "react-native";
import { Button, TextInput } from "react-native-paper";
import auth from "@react-native-firebase/auth";

const { width } = Dimensions.get("window");

function EditPAsswordModal({ modalVisible, setModalVisible }) {
  const user = auth().currentUser;

  const [password, setPassword] = useState("");
  const [isHide, setIsHide] = useState(true);

  const handleClose = async () => {
    try {
      if (user) {
        await user.updatePassword(password);
        alert("Password Updated!");
      } else {
        alert("User not authenticated!");
      }
    } catch (error) {
      alert(error);
    }
    setModalVisible();
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New Password</Text>
            <TextInput
              label="Password"
              autoCapitalize="none"
              value={password}
              textColor="#ff5f00"
              activeOutlineColor="#121481"
              style={styles.userInput}
              mode="outlined"
              right={
                <TextInput.Icon icon="eye" onPress={() => setIsHide(!isHide)} />
              }
              secureTextEntry={isHide}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              style={[styles.button, styles.buttonClose]}
              onPress={handleClose}
            >
              <Text style={styles.textStyle}>Submit</Text>
            </Button>
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
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userInput: {
    width: (width * 70) / 100,
    borderRadius: 10,
  },

  buttonClose: {
    backgroundColor: "#3572EF",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 8,
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
});

export default EditPAsswordModal;
