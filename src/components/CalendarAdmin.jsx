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
  ScrollView,
} from "react-native";
import { Agenda } from "react-native-calendars";
import AgendaItemAdmin from "./AgendaItemAdmin";
import { Button, Divider, IconButton, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { ContextData } from "../context/ContextDataProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import ModalDraggable from "./ModalDraggable";
import DialogCountPeople from "./DialogCountPeople";
import DinnerList from "./DinnerList";
import Loader from "./Loader";
import PdfButton from "./PdfButton";
import DinnerPdfButton from "./DinnerPdfButton";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import CountDownItem from "./CountDownItem";
import auth from "@react-native-firebase/auth";
import { Platform } from "react-native";

const { width, height } = Dimensions.get("window");

function CalendarAdmin({ agendaList, setModalVisible, idGroup }) {
  const isAdmin = auth().currentUser.email === "admin@mail.com";

  const { programs, groups, loading, users, fetchData } =
    useContext(ContextData);
  const currentGroup = groups.find((item) => item._id === idGroup);
  const usersFilterdeByGroup = users.filter(
    (item) => item.tokenGroup === currentGroup.tokenGroup
  );
  const today = new Date();

  const [date, setDate] = useState(today);
  const isDinnerDaySet =
    Object.keys(currentGroup?.dinner || {}).length > 0 &&
    currentGroup.dinner[date] &&
    isAdmin;

  useEffect(() => {
    setDinner(
      (isDinnerDaySet && currentGroup?.dinner[date]) || {
        firstDish: [],
        secondDish: [],
        side: [],
        isDeadline: false,
        hours: 0,
        min: 0,
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
  const [events, setEvents] = useState();
  const [confPeople, setConfPeople] = useState([]);
  const [data, setData] = useState();
  const [timeoutTime, setTimeoutTime] = useState(true);
  const [dinner, setDinner] = useState({
    firstDish: [],
    secondDish: [],
    side: [],
    isDeadline: false,
    hours: 0,
    min: 0,
  });

  let remaining =
    currentGroup.dinner !== undefined
      ? (new Date(currentGroup.dinner[date]?.deadline).getTime() -
          new Date().getTime()) /
        1000
      : 0;

  const [dishes, setDishes] = useState({
    first: "",
    second: "",
    side: "",
    isDeadline: false,
    hours: 0,
    min: 0,
  });

  const hideDialog = () => setVisible((prev) => !prev);

  // Save Program
  const handleSaveProgram = () => {
    if (value) {
      setIsDraggableModal(!isDraggableModal);
      const newDragList = [...currentGroup.program[date], value];
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
  const handlePeopleCount = () => {
    let count = 0;
    let confirmedPeople = [];
    let confPeople2 = {};
    usersFilterdeByGroup.forEach((elem) => {
      const nums = elem.program[date].reduce((tot, objItem) => {
        const isConf = objItem.isConfirmed ? 1 : 0;
        if (isConf === 1) {
          confirmedPeople.push(elem);
          const title = objItem.title;
          // Check if the title already exists in confPeople2; if not, initialize it
          if (!confPeople2[title]) {
            confPeople2[title] = [];
          }

          // Append the current user to the array for the title
          confPeople2[title].push(elem);
        }
        return tot + isConf;
      }, 0);
      count += nums;
    });

    const currentEvents = Object.keys(confPeople2);

    if (count > 0) {
      setVisible((prev) => !prev);
      setConfPeople(confPeople2);
      setCount(count);
      setEvents(currentEvents);
    } else {
      alert("No people confirmed or not event optionable!");
    }
  };

  const handleUpdateDinner = (type, filterList) => {
    setDinner((prev) => ({ ...prev, [type]: filterList }));
  };

  const saveDinner = async (hours, min) => {
    const now = new Date();
    const idGroup = currentGroup._id;
    const dinnerDeadline = {
      ...dinner,
      hours: hours,
      min: min,
      isDeadline: hours > 0 || min > 0 ? true : false,
      deadline:
        hours > 0 || min > 0
          ? new Date(now.getTime() + (hours * 60 + min) * 60 * 1000)
          : null,
    };

    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postAdminDinner",
          {
            idGroup,
            date,
            dinnerDeadline,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);

          setIsModalDinner((prev) => !prev);
          fetchData();
        })
        .catch((res) => Alert.alert(res.data.status, res.data.message));
    } catch (error) {
      alert("Error request posting dinner!");
    }
  };

  const handleSaveDinner = async () => {
    if (
      dinner.firstDish.length === 0 ||
      dinner.secondDish.length === 0 ||
      dinner.side.length === 0
    ) {
      alert("Please fill all dinner input!");
      return;
    }
    try {
      // Save the initial dinner
      await saveDinner(dishes.hours, dishes.min);

      // console.log("Time in DB:", new Date(currentGroup.dinner[date]?.deadline));

      // if (dishes.hours > 0 || dishes.min > 0) {
      //   // Wait for the remaining time
      //   const timer = dishes.hours * 3600000 + dishes.min * 60000;
      //   setTimeout(async () => {
      //     await saveDinner(0, 0);
      //   }, timer);
      //   console.log("Timeout TRIGGERED!");
      // }
    } catch (error) {
      console.error("Error in handleSaveDinner:", error.message);
      Alert.alert("Error", "Error in handling dinner save!");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View
      style={{ flex: 1, width, paddingTop: Platform.OS === "ios" ? 50 : 10 }}
    >
      <View
        style={{
          justifyContent:
            Object.keys(currentGroup?.dinner || {}).length > 0 &&
            currentGroup.dinner[date] &&
            isAdmin
              ? "space-between"
              : "flex-end",
          alignItems: "center",
          marginHorizontal: 10,
          flexDirection: "row",
        }}
      >
        {Object.keys(currentGroup?.dinner || {}).length > 0 &&
          currentGroup.dinner[date] &&
          isAdmin && (
            <DinnerPdfButton
              currentUsers={usersFilterdeByGroup}
              textBtn="Dinner Pdf"
              event="Dinner"
              date={date}
            />
          )}

        <Button
          icon={"close"}
          textColor="red"
          mode="outlined"
          onPress={() => setModalVisible(false)}
          style={{ borderColor: "red" }}
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
          return <AgendaItemAdmin item={item} idGroup={idGroup} date={date} />;
        }}
        onDayPress={(day) => {
          console.log("DAY:", day.dateString);
          setDishes({
            first: "",
            second: "",
            side: "",
            isDeadline: false,
            hours: 0,
            min: 0,
          });
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
      {Object.keys(agendaList).includes(date) && isAdmin && (
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: Platform.OS === "ios" ? 40 : 20,
            paddingHorizontal: Platform.OS === "ios" ? 20 : 20,

            width,
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
            onPress={handlePeopleCount}
          >
            People
          </Button>
          <DialogCountPeople
            visible={visible}
            hideDialog={hideDialog}
            count={count}
            total={currentGroup.peopleCount}
            events={events}
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
          <View style={[styles.modalView, styles.eventModal]}>
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
              tokenGroup={currentGroup.tokenGroup}
              date={date}
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
        presentationStyle="fullScreen"
        visible={isModalDinner}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsModalDinner(!isModal);
        }}
      >
        <View style={styles.centeredView}>
          <ScrollView contentContainerStyle={styles.modalView}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width,
              }}
            >
              <Text style={styles.titleMenu}>Set Menu Of the Day</Text>

              <IconButton
                icon="close"
                iconColor="red"
                onPress={() => setIsModalDinner(!isModalDinner)}
                style={{ marginRight: 20 }}
              />
            </View>

            <TextInput
              label="First Dish"
              value={dishes.first}
              onChangeText={(text) =>
                setDishes((prev) => ({ ...prev, first: text }))
              }
              right={
                <TextInput.Icon
                  onPress={() => {
                    if (dishes.first === "") {
                      alert("Please insert some text!");
                      return;
                    }
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
                    if (dishes.second === "") {
                      alert("Please insert some text!");
                      return;
                    }
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
                    if (dishes.side === "") {
                      alert("Please insert some text!");
                      return;
                    }
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

            <Divider />
            <Text style={styles.titleMenu}>Set Deadline</Text>

            <View style={styles.deadline}>
              <TextInput
                mode="outlined"
                keyboardType="numeric"
                label={"Hours"}
                value={dishes.hours}
                onChangeText={(text) =>
                  setDishes((prev) => ({ ...prev, hours: parseInt(text) }))
                }
              />

              <TextInput
                mode="outlined"
                keyboardType="numeric"
                label={dishes.min > 60 ? "Max 60" : "Minutes"}
                value={dishes.min}
                error={dishes.min > 60}
                onChangeText={(text) =>
                  setDishes((prev) => ({ ...prev, min: parseInt(text) }))
                }
              />
              {dinner.isDeadline && (
                <View style={styles.deadlineView}>
                  <View style={styles.timer}>
                    <CountdownCircleTimer
                      isPlaying
                      duration={remaining}
                      colors={["#074799", "#009990", "#ECE852", "#FB4141"]}
                      colorsTime={[remaining, remaining / 3, remaining / 2, 0]}
                      size={50}
                      strokeWidth={4}
                    >
                      {({ remainingTime }) => (
                        <CountDownItem remainingTime={remainingTime} />
                      )}
                    </CountdownCircleTimer>
                  </View>

                  <View>
                    <Text>Deadline ended up!</Text>
                    {dinner.isDeadline && (
                      <Text style={{ color: "dodgerblue" }}>
                        {dinner.hours} h - {dinner.min} m{" "}
                        <Text style={{ fontSize: 10, color: "grey" }}>
                          (duration)
                        </Text>
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            <Button
              icon={"food-fork-drink"}
              mode="elevated"
              buttonColor="dodgerblue"
              textColor="aliceblue"
              onPress={handleSaveDinner}
              style={{ marginTop: 30, alignSelf: "center" }}
            >
              Save Dinner
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 40,
    alignItems: "flex-start",
  },
  eventModal: {
    margin: 20,
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
  buttonClose: {
    position: "absolute",
    right: -10,
    top: 5,
  },
  buttonCloseDinner: { position: "absolute", top: 30, right: 0 },
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
    width: (width * 80) / 100,
    backgroundColor: "aliceblue",
  },
  titleMenu: {
    color: "dodgerblue",
    fontSize: 20,
    paddingVertical: 20,
    fontWeight: "bold",
  },
  deadline: {
    justifyContent: "flex-start",
    flexDirection: "row",
    backgroundColor: "aliceblue",
    padding: 20,
    borderRadius: 12,
    width: (width * 80) / 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  deadlineView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  timer: {
    position: "absolute",
    top: -50,
    right: -10,
  },
});

export default CalendarAdmin;
