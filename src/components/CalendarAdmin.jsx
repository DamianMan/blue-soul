import React, { useContext, useState } from "react";
import {
  Dimensions,
  Pressable,
  View,
  Modal,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import { Agenda } from "react-native-calendars";
import AgendaItemAdmin from "./AgendaItemAdmin";
import { Button } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { ContextData } from "../context/ContextDataProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import ModalDraggable from "./ModalDraggable";

const { width, height } = Dimensions.get("window");

function CalendarAdmin({ agendaList, setModalVisible, idGroup, setReload }) {
  const { programs, groups, loading } = useContext(ContextData);
  const today = new Date();
  const [date, setDate] = useState(today);
  const [isModal, setIsModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState();
  const [isDraggableModal, setIsDraggableModal] = useState(false);
  const [draggableList, setDraggableList] = useState([]);

  const currenGroup = groups.find((item) => item._id === idGroup);
  console.log("Agenda LISt in Calendar:", agendaList);

  const dataPrograms = () => {
    const newArray = programs.map((item) => ({
      label: `${item.hour} - ${item.title}`,
      value: item._id,
    }));
    return newArray;
  };

  const handleAddProgram = async () => {
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/addProgramDay",
          {
            idGroup,
            date,
            value,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          setReload();
          setIsModal(!isModal);
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      alert("Error adding request!");
    }
  };

  return (
    <View style={{ flex: 1, width, paddingTop: 50 }}>
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginRight: 10,
        }}
      >
        <Button
          icon={"close"}
          textColor="red"
          mode="outlined"
          onPress={() => setModalVisible(false)}
        >
          Close
        </Button>
      </View>

      <Agenda
        key={date} // Forces re-render
        date={date || today}
        items={agendaList}
        selected={date}
        showOnlySelectedDayItems={true}
        keyExtractor={(item, index) => item._id + date + index}
        renderItem={(item) => {
          return (
            <AgendaItemAdmin
              item={item}
              idGroup={idGroup}
              date={date}
              setReload={setReload}
            />
          );
        }}
        loadItemsForMonth={(month) => {
          console.log("Loading items for month:", month);
          // Optionally load more items dynamically based on `month`
        }}
        onDayPress={(day) => {
          console.log("DAY:", day.dateString);
          setDate((prev) => day.dateString); // Updates state with the selected date
        }}
        renderEmptyData={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No Progams In This Date!</Text>
            </View>
          );
        }}
      />
      <View>
        <Button
          icon={"plus"}
          textColor="dodgerblue"
          style={{ height: 60, justifyContent: "center" }}
          onPress={() => setIsModal(!isModal)}
        >
          Add Program
        </Button>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsModal(!isModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button
              icon="close"
              textColor="red"
              onPress={() => setIsModal(!isModal)}
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
              placeholder={!isFocus ? "Select Program" : "..."}
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
              icon={"plus"}
              mode="elevated"
              buttonColor="dodgerblue"
              textColor="aliceblue"
              onPress={() => {
                if (value) {
                  setIsDraggableModal(!isDraggableModal);
                  const newDragList = [...currenGroup.program[date], value];
                  const convertedList = newDragList.map((item) => {
                    const obj = programs.find((i) => i._id === item);
                    if (obj) {
                      return obj;
                    }
                  });

                  console.log("List:", convertedList);
                  setDraggableList(convertedList);
                } else {
                  alert("Please Select a Program!");
                }
              }}
              style={{ marginTop: 20 }}
            >
              Add
            </Button>
            <ModalDraggable
              setIsDraggableModal={setIsDraggableModal}
              isDraggableModal={isDraggableModal}
              draggableList={draggableList}
              idGroup={idGroup}
              date={date}
              setReload={setReload}
              setIsModal={setIsModal}
              isModal={isModal}
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
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
  },
  buttonClose: {
    position: "absolute",
    right: -10,
    top: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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

export default CalendarAdmin;
