import React from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState, useContext } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { ContextData } from "../context/ContextDataProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function AgendaItemAdmin({ item, idGroup, date }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState();

  const { programs, groups } = useContext(ContextData);
  const [isFocus, setIsFocus] = useState(false);

  const dataPrograms = () => {
    const newArray = programs.map((item) => ({
      label: `${item.hour} - ${item.title}`,
      value: item._id,
    }));
    return newArray;
  };

  const itemPressed = () => {
    Alert.alert(`${item._id} - ${item.hour} - ${item.title} - ${idGroup}`);
  };
  const buttonPressed = () => {
    setModalVisible(!modalVisible);
    console.log("Item ID:", item._id);
  };

  const handleSave = async () => {
    const currenGroup = groups.find((item) => item._id === idGroup);
    console.log("Old Program:", currenGroup.program);
    const newProgram = currenGroup.program[date].map((obj) => {
      if (obj === item._id) {
        return value;
      } else {
        return obj;
      }
    });
    console.log("New Program:", newProgram);
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/editProgramDay",
          {
            idGroup,
            date,
            newProgram,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => Alert.alert(res.data.status, res.data.message))
        .catch((err) => Alert.alert(res.data.status, res.data.message));
    } catch (error) {
      alert("Error making edit program day request");
    }
  };
  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemTitleText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.title}</Text>
      </View>
      <View style={styles.itemButtonContainer}>
        <Button
          mode="elevated"
          buttonColor={"#2185D5"}
          textColor="aliceblue"
          onPress={buttonPressed}
        >
          Edit
        </Button>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button
              icon="close"
              textColor="red"
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.buttonClose}
            ></Button>
            <Dropdown
              style={[
                styles.dropdown,
                isFocus && { borderColor: "dodgerblue" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={dataPrograms()}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select item" : "..."}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => {
                setIsFocus(false);
              }}
              onChange={(item) => {
                console.log("Selecetd:", item.value);
                setValue(item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus ? "dodgerblue" : "black"}
                  name="Safety"
                  size={20}
                />
              )}
            />
            <Button
              icon="file-document-edit-outline"
              mode="elevated"
              textColor="aliceblue"
              buttonColor="dodgerblue"
              style={styles.buttonSave}
              onPress={handleSave}
            >
              Save
            </Button>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: "aliceblue",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
    borderRadius: 5,
    marginVertical: 5,
  },
  itemHourText: {
    color: "black",
  },
  itemDurationText: {
    color: "#393E46",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: "black",
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  emptyItemText: {
    color: "lightgrey",
    fontSize: 14,
  },
  modalView: {
    margin: 20,
    backgroundColor: "snow",
    borderRadius: 20,
    padding: 45,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: (width * 80) / 100,
  },
  textInput: {
    width: (width * 70) / 100,
    backgroundColor: "aliceblue",
    marginVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonSave: {
    borderColor: "dodgerblue",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonClose: {
    position: "absolute",
    right: -10,
    top: 5,
  },
  dropdown: {
    height: 50,
    width: (width * 60) / 100,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "lightskyblue",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "azure",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    padding: 8,
    width: 100,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },

  containerStyle: {
    width: (width * 80) / 100,
    height: height / 2,
  },
});
