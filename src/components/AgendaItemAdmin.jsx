import React, { useEffect } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import { useState, useContext, memo } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { ContextData } from "../context/ContextDataProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import auth from "@react-native-firebase/auth";

const { width, height } = Dimensions.get("window");

function AgendaItemAdmin({ item, idGroup, date }) {
  const isAdmin = auth().currentUser.email === "admin@mail.com";

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState();
  const [dateValue, setDateValue] = useState();

  const { programs, groups, loading, fetchData } = useContext(ContextData);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusDate, setIsFocusDate] = useState(false);

  const currenGroup = groups.find((item) => item._id === idGroup);

  const dataPrograms = () => {
    const newArray = programs.map((item) => ({
      label: `${item.hour} - ${item.title}`,
      value: item._id,
    }));
    return newArray;
  };

  const datesProgram = () => {
    let displyDates = [];
    Object.entries(currenGroup.program).forEach(([key, value]) => {
      displyDates.push(key);
    });
    const newDates = displyDates.map((elem) => ({
      label: elem,
      value: elem,
    }));
    return newDates;
  };

  const itemPressed = () => {
    Alert.alert(item.title, item.description);
  };
  const handleEdit = () => {
    setModalVisible(!modalVisible);
  };

  const handleSaveEdit = async () => {
    console.log("Old Program:", currenGroup.program);
    const programToAdd = programs.find((item) => item._id === value);
    const newProgram = currenGroup.program[date].map((obj) => {
      if (obj._id === item._id) {
        return programToAdd;
      } else {
        return obj;
      }
    });
    console.log("New PRogram:", newProgram);
    const { tokenGroup } = currenGroup;
    const filterIdValue = value;
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/editProgramDay",
          {
            idGroup,
            tokenGroup,
            date,
            newProgram,
            filterIdValue,
            programToAdd,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          fetchData();
          setModalVisible(!modalVisible);
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
      console.log("New Program:", newProgram);
    } catch (error) {
      alert(
        "Error making edit: Please the day you want modify needs to be selected or error Request!"
      );
    }
  };

  const handleDelete = async () => {
    console.log("Old Program:", currenGroup.program);
    const { tokenGroup } = currenGroup;
    const newProgramGroup = currenGroup.program[date].filter((obj) => {
      if (obj._id !== item._id) {
        return obj;
      } else {
        return value;
      }
    });

    console.log("NEW PROGRMA:", newProgramGroup);
    const itemId = item._id;

    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/deleteProgramDay",
          {
            idGroup,
            tokenGroup,
            date,
            newProgramGroup,
            itemId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
          fetchData();
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      alert("Error making delete program day request1");
    }
  };
  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      {isAdmin && (
        <IconButton
          icon={"delete-circle-outline"}
          iconColor="red"
          onPress={handleDelete}
          style={{
            position: "absolute",
            top: -15,
            right: -10,
          }}
        />
      )}
      {item.isOptional && <Text style={styles.optional}>Optional</Text>}

      <View style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
        <Text style={styles.itemTitleText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.title}</Text>
      </View>
      <View style={styles.itemButtonContainer}>
        {isAdmin && (
          <Button
            icon={"file-document-edit-outline"}
            mode="outlined"
            textColor="dodgerblue"
            buttonColor="#fff"
            onPress={handleEdit}
          >
            Edit
          </Button>
        )}
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
            <IconButton
              icon="close"
              iconColor="red"
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.buttonClose}
            />
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
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? `${item.hour} - ${item.title}` : "..."}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => {
                setIsFocus(false);
              }}
              onChange={(item) => {
                console.log("SelecITEM:", item);
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
              onPress={handleSaveEdit}
            >
              Save Edit
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
  },
  itemTitleText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 20,
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
    right: 0,
    top: 0,
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
  optional: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "lightseagreen",
    color: "aliceblue",
    marginLeft: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 3,

    fontSize: 9,
  },
});

export default AgendaItemAdmin;
