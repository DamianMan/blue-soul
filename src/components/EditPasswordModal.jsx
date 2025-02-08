import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, Dimensions, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import { API_KEY_PROTECTED } from "@env";

const { width, height } = Dimensions.get("window");

function EditPAsswordModal({ modalVisible, setModalVisible }) {
  const user = auth().currentUser;

  const [password, setPassword] = useState("");
  const [isHide, setIsHide] = useState(true);

  const handleSubmit = async () => {
    const email = user.email;
    if (password === "") {
      alert("Please fill the field");
    } else {
      try {
        if (user) {
          await user.updatePassword(password);
          await axios
            .post(
              "https://blue-soul-app.onrender.com/api/editPassword",
              {
                password,
                email,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": API_KEY_PROTECTED,
                },
              }
            )
            .then((response) => {
              setPassword("");
              Alert.alert(response.data.status, response.data.message);
              setIsHide(true);
            })
            .catch((err) => {
              setPassword("");
              setIsHide(true);

              Alert.alert("Alert", err);
            });
        } else {
          alert("User not authenticated!");
        }
      } catch (error) {
        alert(error);
      }
      setModalVisible();
    }
  };

  const handleClose = () => {
    setModalVisible();
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleSubmit}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New Password</Text>
            <TextInput
              label="Password"
              autoCapitalize="none"
              value={password}
              textColor="#303841"
              activeOutlineColor="#2185D5"
              style={styles.userInput}
              mode="outlined"
              right={
                <TextInput.Icon icon="eye" onPress={() => setIsHide(!isHide)} />
              }
              secureTextEntry={isHide}
              onChangeText={(text) => setPassword(text)}
            />
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Button style={styles.buttonSubmit} onPress={handleSubmit}>
                <Text style={styles.textStyle}>Submit</Text>
              </Button>
              <Button style={styles.buttonClose} onPress={handleClose}>
                <Text style={styles.textStyle}>Close</Text>
              </Button>
            </View>
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
    backgroundColor: "aliceblue",
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

  buttonSubmit: {
    backgroundColor: "dodgerblue",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "red",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#2185D5",
  },
});

export default EditPAsswordModal;
