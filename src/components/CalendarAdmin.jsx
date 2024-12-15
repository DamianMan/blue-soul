import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  View,
  Modal,
  StyleSheet,
  Text,
  Alert,
  FlatList,
} from "react-native";
import { Agenda } from "react-native-calendars";
import AgendaItemAdmin from "./AgendaItemAdmin";
import { Button, IconButton, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { ContextData } from "../context/ContextDataProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import ModalDraggable from "./ModalDraggable";
import DialogCountPeople from "./DialogCountPeople";
import DinnerList from "./DinnerList";
import Loader from "./Loader";

const { width, height } = Dimensions.get("window");

function CalendarAdmin({ agendaList, setModalVisible, idGroup, setReload }) {
  const { programs, groups, loading, users, fetchData } =
    useContext(ContextData);
  const currenGroup = groups.find((item) => item._id === idGroup);
  const usersFilterdeByGroup = users.filter(
    (item) => item.tokenGroup === currenGroup.tokenGroup
  );
  const today = new Date();

  const [date, setDate] = useState(today);

  useEffect(() => {
    setDinner(
      currenGroup.dinner[date] || {
        firstDish: [],
        secondDish: [],
        side: [],
      }
    );
  }, [dinner, date]);

  useEffect(() => {
    const dataPrograms = () => {
      const newArray = programs.map((item) => ({
        label: `${item.hour} - ${item.title}`,
        value: item,
      }));
      return newArray;
    };
    setData(dataPrograms());
  }, [data]);
  const [isModal, setIsModal] = useState(false);
  const [isModalDinner, setIsModalDinner] = useState(false);

  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState();
  const [isDraggableModal, setIsDraggableModal] = useState(false);
  const [draggableList, setDraggableList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState();
  const [event, setEvent] = useState();
  const [confPeople, setConfPeople] = useState([]);
  const [data, setData] = useState();
  const [dinner, setDinner] = useState(
    currenGroup?.dinner[date] || {
      firstDish: [],
      secondDish: [],
      side: [],
    }
  );
  console.log("DINNER IN DB:", dinner);

  const [dishes, setDishes] = useState({ first: "", second: "", side: "" });

  const hideDialog = () => setVisible((prev) => !prev);

  // Save Program
  const handleSaveProgram = () => {
    if (value) {
      setIsDraggableModal(!isDraggableModal);
      const newDragList = [...currenGroup.program[date], value];
      // const convertedList = newDragList.map((item) => {
      //   const obj = programs.find((i) => i._id === item.id);
      //   if (obj) {
      //     return obj;
      //   }
      // });

      console.log("DRAGGABLE List:", newDragList);
      setDraggableList(newDragList);
    } else {
      alert("Please Select a Program!");
    }
  };

  // Count People optional event
  const handlePeople = () => {
    console.log("users:", usersFilterdeByGroup);
    let count = 0;
    let confirmedPeople = [];
    usersFilterdeByGroup.forEach((elem) => {
      console.log("Evente:", elem.program[date]);
      const nums = elem.program[date].reduce((tot, objItem) => {
        const isConf = objItem.isConfirmed ? 1 : 0;
        console.log("Adding:", isConf);
        if (isConf === 1) {
          confirmedPeople.push(elem);
        }
        return tot + isConf;
      }, 0);
      count += nums;
    });
    console.log("COunt:", count);

    const currentEvent = usersFilterdeByGroup[0].program[date].find(
      (item) => item.isConfirmed
    );
    console.log("Info Confirmed People:", confirmedPeople);

    if (count > 0) {
      setVisible((prev) => !prev);
      setConfPeople(confirmedPeople);
      setCount(count);
      setEvent(currentEvent.title);
    } else {
      alert("No people confirmed or not event optionable!");
    }
  };

  const handleUpdateDinner = (type, filterList) => {
    setDinner((prev) => ({ ...prev, [type]: filterList }));
  };

  const saveDinner = async () => {
    const idGroup = currenGroup._id;

    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postAdminDinner",
          {
            idGroup,
            date,
            dinner,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          fetchData();
          Alert.alert(res.data.status, res.data.message);
          setDinner({
            firstDish: [],
            secondDish: [],
            side: [],
          });
          setIsModalDinner((prev) => !prev);
        })
        .catch((res) => Alert.alert(res.data.status, res.data.message));
    } catch (error) {
      alert("Error request posting dinner!");
    }
  };

  if (loading) {
    return <Loader />;
  }

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
      {Object.keys(agendaList).includes(date) && (
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            padding: 30,
          }}
        >
          <Button
            icon={"plus"}
            mode="elevated"
            textColor="dodgerblue"
            style={styles.buttonCalendar}
            onPress={() => setIsModal(!isModal)}
          >
            Event
          </Button>
          <Button
            icon={"food-fork-drink"}
            mode="elevated"
            textColor="dodgerblue"
            style={styles.buttonCalendar}
            onPress={() => {
              setIsModalDinner(!isModalDinner);
            }}
          >
            Dinner
          </Button>
          <Button
            icon={"format-list-numbered"}
            mode="elevated"
            textColor="dodgerblue"
            style={styles.buttonCalendar}
            onPress={handlePeople}
          >
            People
          </Button>
          <DialogCountPeople
            visible={visible}
            hideDialog={hideDialog}
            count={count}
            total={currenGroup.peopleCount}
            event={event}
            peopleList={confPeople}
          />
        </View>
      )}

      {/* MODAL ADD PROGRAM AND RE-ORDER */}

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
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!value ? "Select Program" : value.title}
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
              icon={"calendar"}
              mode="elevated"
              buttonColor="dodgerblue"
              textColor="aliceblue"
              onPress={handleSaveProgram}
              style={{ marginTop: 20 }}
            >
              Save Event
            </Button>
            <ModalDraggable
              setIsDraggableModal={setIsDraggableModal}
              isDraggableModal={isDraggableModal}
              draggableList={draggableList}
              idGroup={idGroup}
              tokenGroup={currenGroup.tokenGroup}
              date={date}
              setReload={setReload}
              setIsModal={setIsModal}
              isModal={isModal}
              value={value}
              usersFilterdeByGroup={usersFilterdeByGroup}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL ADD DINNER TO DATE */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalDinner}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsModalDinner(!isModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button
              icon="close"
              textColor="red"
              onPress={() => setIsModalDinner(!isModalDinner)}
              style={styles.buttonClose}
            ></Button>

            <TextInput
              label="First Dish"
              value={dishes.first}
              onChangeText={(text) =>
                setDishes((prev) => ({ ...prev, first: text }))
              }
              right={
                <TextInput.Icon
                  onPress={() => {
                    setDinner((prev) => ({
                      ...prev,
                      firstDish: [...prev.firstDish, dishes.first],
                    }));
                    setDishes((prev) => ({ ...prev, first: "" }));
                  }}
                  icon="plus-circle"
                  iconColor="lightskyblue"
                />
              }
              style={styles.dinnerInput}
            />
            {dinner.firstDish.length > 0 && (
              <DinnerList
                data={dinner.firstDish}
                handleUpdateDinner={handleUpdateDinner}
                type="firstDish"
              />
            )}
            <TextInput
              label="Second Dish"
              value={dishes.second}
              onChangeText={(text) =>
                setDishes((prev) => ({ ...prev, second: text }))
              }
              right={
                <TextInput.Icon
                  onPress={() => {
                    setDinner((prev) => ({
                      ...prev,
                      secondDish: [...prev.secondDish, dishes.second],
                    }));
                    setDishes((prev) => ({ ...prev, second: "" }));
                  }}
                  icon="plus-circle"
                  iconColor="lightskyblue"
                />
              }
              style={styles.dinnerInput}
            />
            {dinner.secondDish.length > 0 && (
              <DinnerList
                data={dinner.secondDish}
                handleUpdateDinner={handleUpdateDinner}
                type="secondDish"
              />
            )}
            <TextInput
              label="Side"
              value={dishes.side}
              onChangeText={(text) =>
                setDishes((prev) => ({ ...prev, side: text }))
              }
              right={
                <TextInput.Icon
                  onPress={() => {
                    setDinner((prev) => ({
                      ...prev,
                      side: [...prev.side, dishes.side],
                    }));
                    setDishes((prev) => ({ ...prev, side: "" }));
                  }}
                  icon="plus-circle"
                  iconColor="lightskyblue"
                />
              }
              style={styles.dinnerInput}
            />
            {dinner.side.length > 0 && (
              <DinnerList
                data={dinner.side}
                handleUpdateDinner={handleUpdateDinner}
                type="side"
              />
            )}
            <Button
              icon={"food-fork-drink"}
              mode="elevated"
              buttonColor="dodgerblue"
              textColor="aliceblue"
              onPress={saveDinner}
              style={{ marginTop: 20 }}
            >
              Save Dinner
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
  buttonCalendar: {
    marginHorizontal: 5,
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
  dinnerInput: {
    width: (width * 70) / 100,
    backgroundColor: "aliceblue",
  },
  dinnerList: {},
});

export default CalendarAdmin;
