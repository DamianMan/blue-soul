import { useContext, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import { ContextData } from "../context/ContextDataProvider";
import axios from "axios";
import { API_KEY_PROTECTED } from "@env";

const { width } = Dimensions.get("window");
function GroupEditModal({ toggleModal, modalVisible, idGroup }) {
  const { groups, fetchData } = useContext(ContextData);
  const currentGroup = groups.find((item) => item._id === idGroup);
  const { fullNameTeacher, city, email, phone, peopleCount, nameGroup, hotel } =
    currentGroup;
  console.log("current group:", currentGroup);
  const [editGroupForm, setEditGroupForm] = useState([
    {
      id: "nameGroup",
      value: nameGroup,
    },
    {
      id: "fullName",
      value: fullNameTeacher,
    },

    {
      id: "email",
      value: email,
    },
    {
      id: "phone",
      value: phone,
    },
    {
      id: "city",
      value: city,
    },
    {
      id: "hotel",
      value: hotel,
    },
    {
      id: "people",
      value: String(peopleCount),
    },
  ]);

  const handleChangeText = (text, id) => {
    const newList = editGroupForm.map((item) => {
      if (item.id === id) {
        return { ...item, value: text };
      } else {
        return item;
      }
    });
    setEditGroupForm(newList);
  };

  const handleSave = async () => {
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/editGroup",
          {
            idGroup,
            editGroupForm,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY_PROTECTED,
            },
          }
        )
        .then((res) => {
          toggleModal();
          Alert.alert(res.data.status, res.data.message);
          fetchData();
        })
        .catch((res) => Alert.alert(res.data.status, res.data.message));
    } catch (error) {
      alert("Error request editing group!");
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        toggleModal();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <IconButton
            icon={"close"}
            iconColor="red"
            onPress={toggleModal}
            style={styles.buttonClose}
          />
          <Text style={styles.title}>Edit Group</Text>
          <FlatList
            data={editGroupForm}
            keyExtractor={(item) => item.id}
            style={styles.input}
            renderItem={({ item }) => (
              <TextInput
                mode="outlined"
                keyboardType={item.id === "people" ? "numeric" : "default"}
                label={item.id}
                placeholder={item.value}
                value={item.value}
                textColor="#000"
                activeOutlineColor="dodgerblue"
                onChangeText={(text) => handleChangeText(text, item.id)}
              />
            )}
          />
          <Button
            mode="elevated"
            icon={"database-plus"}
            textColor="aliceblue"
            buttonColor="dodgerblue"
            onPress={handleSave}
            style={styles.buttonSave}
          >
            Save
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
  modalView: {
    width: (width * 90) / 100,
    backgroundColor: "aliceblue",
    borderRadius: 20,
    paddingVertical: 55,
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
  title: {
    fontSize: 20,
    color: "dodgerblue",
    paddingBottom: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonSave: {
    marginTop: 40,
  },
  buttonClose: {
    position: "absolute",
    right: 0,
    top: 0,
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
  input: {
    width: (width * 70) / 100,
  },
});

export default GroupEditModal;
