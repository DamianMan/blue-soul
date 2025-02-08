import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Agenda } from "react-native-calendars";
import Loader from "./Loader";
import AgendaItem from "./AgendaItem";
import { useContext } from "react";
import { ContextData } from "../context/ContextDataProvider";
import auth from "@react-native-firebase/auth";
import {
  Button,
  Divider,
  IconButton,
  SegmentedButtons,
  RadioButton,
} from "react-native-paper";
import axios from "axios";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import CountDownItem from "./CountDownItem";
import { API_KEY_PROTECTED } from "@env";

const { height, width } = Dimensions.get("window");

// Example agenda data
// const ITEMS = (program, userProgram) => {
//   transformedData = {};
//   for (const [key, value] of Object.entries(program)) {
//     const hasConfirmedUser = userProgram[key].some(
//       (item) => item.isConfirmed === true
//     );
//     const hasConfirmedGroup = value.some((item) => item.isConfirmed === true);
//     console.log("User program has confirmed?", hasConfirmedUser);

//     console.log("Value in ITems for agenda:", value);
//     const optionalFalseList = value.filter((elem) => elem.isOptional === false);
//     let mergedList = [...userProgram[key], ...optionalFalseList];
//     console.log("MErged List:", mergedList);
//     if (hasConfirmedGroup && hasConfirmedUser) {
//       transformedData[key] = mergedList;
//     } else if (!hasConfirmedGroup && hasConfirmedUser) {
//       mergedList = [...optionalFalseList];
//       transformedData[key] = mergedList;
//     } else {
//       transformedData[key] = value;
//     }
//   }
//   return transformedData;
// };

function CalendarUser(props) {
  const { programs, groups, users, loading, fetchData, sortedArray, getUsers } =
    useContext(ContextData);

  useEffect(() => {
    const ITEMS = (data) => {
      transformedData = {};
      // let data = {
      //   "2024-11-19": ["673b5ad113a096ad05640ca9", "673b5e2b13a096ad05640cb2"],
      //   "2024-11-20": ["673b5d6a13a096ad05640cad", "673b5e7b13a096ad05640cb3"],
      //   "2024-11-21": ["673b5b3a13a096ad05640caa", "673b5ead13a096ad05640cb4"],
      //   "2024-11-22": ["673b5b3a13a096ad05640caa", "673b5e2b13a096ad05640cb2"],
      //   "2024-11-23": ["673b5cd713a096ad05640cab", "673b5ead13a096ad05640cb4"],
      //   "2024-11-24": ["673b5d6a13a096ad05640cad"],
      // };
      for (const [key, value] of Object.entries(data)) {
        sortedList = sortedArray(value);
        transformedData[key] = sortedList;
      }
      setItems(transformedData);
    };
    ITEMS(userDb.program || program);
  }, []);

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const user = auth().currentUser;
  const { email } = user;
  const userDb = users.find((item) => item.email === user.email);

  const currentGroup = groups.find(
    (item) => item.tokenGroup === userDb.tokenGroup
  );
  const idGroup = currentGroup?.tokenGroup;

  const { program, dinner } = currentGroup;

  const [date, setDate] = useState(formattedDate);

  const remaining =
    currentGroup.dinner?.hasOwnProperty(date) &&
    (new Date(currentGroup.dinner[date].deadline).getTime() -
      new Date().getTime()) /
      1000;

  const [items, setItems] = useState();
  const [value, setValue] = useState([]);
  const [noOption, setNoOption] = useState(false);
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);
  const [dinnerModal, setDinnerModal] = useState(false);
  const [firstDinnerBtn, setFirstDinnerBtn] = useState([]);
  const [secondDinnerBtn, setSecondDinnerBtn] = useState([]);
  const [sideDinnerBtn, setSideDinnerBtn] = useState([]);
  const [noDinnerChoice, setNoDinnerChoice] = useState(false);
  const [dinnerConfirm, setDinnerConfirm] = useState({
    firstDish: "",
    secondDish: "",
    side: "",
    isDinnerConfirmed: false,
  });
  const [isDinnerBtn, setIsDinnerBtn] = useState(false);

  if (loading) {
    return <Loader />;
  }

  const noDinner = {
    firstDish: "I don't want any first dish.",
    secondDish: "I don't want any second dish.",
    side: "I don't want any side.",
    isDinnerConfirmed: true,
  };

  const timeUpNoDinner = {
    firstDish: "Didn't select any first dish.",
    secondDish: "Didn't select any second dish.",
    side: "Didn't select any side.",
    isDinnerConfirmed: true,
  };
  const handleSaveNoDinner = () => {
    setNoDinnerChoice((prev) => !prev);

    setDinnerConfirm(noDinner);
  };

  const handleSaveProgram = async () => {
    const checkOptional = value.filter((elem) => elem.isOptional === true);
    const filterItemsNoOptional = items[date].filter(
      (elem) => elem.isOptional === false
    );
    const newValues = [...value, ...filterItemsNoOptional];
    const sortedArray = newValues.sort((a, b) => {
      const [hoursA, minutesA] = a.hour.split(":").map(Number);
      const [hoursB, minutesB] = b.hour.split(":").map(Number);

      const floatA = hoursA + minutesA / 60;
      const floatB = hoursB + minutesB / 60;

      return floatA - floatB; // Ascending order
    });
    if (checkOptional.length > 1) {
      alert("Please select just ONE event!");
      return;
    }
    if (checkOptional.length > 0) {
      try {
        await axios
          .post(
            "https://blue-soul-app.onrender.com/api/postDailyProgramByUser",
            { email, date, value: sortedArray },
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY_PROTECTED,
              },
            }
          )
          .then((res) => {
            Alert.alert(res.data.status, res.data.message);
            setSaved((prev) => !prev);
            fetchData();
          })
          .catch((err) => Alert.alert(err.data.status, err.data.message));
      } catch (error) {
        alert("Error making request to update program by user!");
      }
    } else {
      alert("Please select an event!");
    }
  };

  const toogleDinnerModal = () => {
    setDinnerModal((prev) => !prev);
  };

  const createListSegmentsBtn = (date, type) => {
    const newList = currentGroup.dinner[date][type].map((item) => ({
      value: item,
      label: item,
    }));
    return newList;
  };

  const handleSaveDinner = async (dinner) => {
    const idUser = userDb._id;
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postUserDinner",
          {
            idUser,
            date,
            dinnerConfirm: { ...dinner, isDinnerConfirmed: true },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY_PROTECTED,
            },
          }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
          fetchData();
        })
        .catch((res) => {
          Alert.alert(res.data.status, res.data.message);
        });
    } catch (error) {
      alert("Error making request posting user dinner!");
    }
  };

  const handleCompleteTimer = async () => {
    alert(
      `Dinner timer over in date ${date}!Sorry, You didn't select anything`
    );
    await handleSaveDinner(timeUpNoDinner);
  };

  return (
    <SafeAreaView style={{ flex: 1, width }}>
      <Agenda
        key={date}
        date={date || today}
        selected={date}
        showOnlySelectedDayItems={true}
        items={items}
        renderItem={(item) => (
          <AgendaItem
            item={item}
            setValue={setValue}
            value={value}
            items={items}
            date={date}
            setSelected={setSelected}
            selected={selected}
            saved={saved}
          />
        )}
        onDayPress={(day) => {
          setDate(day.dateString);
          const noOptionItems = items[day.dateString]?.some(
            (item) => item.isConfirmed === false
          );
          setNoOption(noOptionItems);
          setValue([]);
          if (currentGroup.dinner?.hasOwnProperty(day.dateString)) {
            setFirstDinnerBtn(
              createListSegmentsBtn(day.dateString, "firstDish")
            );
            setSecondDinnerBtn(
              createListSegmentsBtn(day.dateString, "secondDish")
            );
            setSideDinnerBtn(createListSegmentsBtn(day.dateString, "side"));
          }
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        {noOption && (
          <Button
            icon={"calendar-text-outline"}
            textColor="dodgerblue"
            mode="elevated"
            buttonColor="#fff"
            onPress={handleSaveProgram}
          >
            Save Program
          </Button>
        )}
        {currentGroup.dinner?.[date] && (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {!userDb.dinner?.[date]?.isDinnerConfirmed &&
              currentGroup.dinner?.[date].deadline !== null && (
                <View
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -25,
                    zIndex: 10,
                  }}
                >
                  <CountdownCircleTimer
                    isPlaying
                    duration={remaining}
                    colors={["#074799", "#009990", "#ECE852", "#FB4141"]}
                    colorsTime={[remaining, remaining / 3, remaining / 2, 0]}
                    size={50}
                    strokeWidth={4}
                    onComplete={handleCompleteTimer}
                  >
                    {({ remainingTime }) => (
                      <CountDownItem remainingTime={remainingTime} />
                    )}
                  </CountdownCircleTimer>
                </View>
              )}
            <Button
              icon={"food-fork-drink"}
              textColor="dodgerblue"
              mode="elevated"
              buttonColor="#fff"
              onPress={toogleDinnerModal}
            >
              Your Dinner
            </Button>
          </View>
        )}
        {/* // Dinner Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={dinnerModal}
          onRequestClose={toogleDinnerModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <IconButton
                icon={"close"}
                iconColor="red"
                style={styles.closeBtn}
                onPress={toogleDinnerModal}
              />
              {userDb.dinner === undefined ? (
                <View>
                  <Text style={styles.titleMenu}>Menu of the day</Text>
                  {/* FIRST DISHES */}
                  <Text style={styles.titleDishes}>First Dishes</Text>

                  <SegmentedButtons
                    value={dinnerConfirm.firstDish}
                    onValueChange={(value) => {
                      if (value === dinnerConfirm.firstDish) {
                        setNoDinnerChoice(true);
                        setDinnerConfirm((prev) => ({
                          ...prev,
                          firstDish: "",
                        }));
                      } else {
                        setDinnerConfirm((prev) => ({
                          ...prev,
                          firstDish: value,
                        }));
                      }
                    }}
                    buttons={firstDinnerBtn}
                    style={styles.segmentsBtn}
                  />
                  {dinnerConfirm.firstDish !== "" && (
                    <View style={styles.textConfirmDishes}>
                      <IconButton icon={"check"} iconColor="limegreen" />
                      <Text>{dinnerConfirm.firstDish}</Text>
                    </View>
                  )}
                  {/* SECOND DISHES */}
                  <Text style={styles.titleDishes}>Second Dishes</Text>

                  <SegmentedButtons
                    value={dinnerConfirm.secondDish}
                    onValueChange={(value) => {
                      if (value === dinnerConfirm.secondDish) {
                        setDinnerConfirm((prev) => ({
                          ...prev,
                          secondDish: "",
                        }));
                      } else {
                        setDinnerConfirm((prev) => ({
                          ...prev,
                          secondDish: value,
                        }));
                      }
                    }}
                    buttons={secondDinnerBtn}
                    style={styles.segmentsBtn}
                  />
                  {dinnerConfirm.secondDish !== "" && (
                    <View style={styles.textConfirmDishes}>
                      <IconButton icon={"check"} iconColor="limegreen" />
                      <Text>{dinnerConfirm.secondDish}</Text>
                    </View>
                  )}
                  {/* SIDE DISHES */}
                  <Text style={styles.titleDishes}>Side Dishes</Text>

                  <SegmentedButtons
                    value={dinnerConfirm.side}
                    onValueChange={(value) => {
                      if (value === dinnerConfirm.side) {
                        setDinnerConfirm((prev) => ({ ...prev, side: "" }));
                      } else {
                        setDinnerConfirm((prev) => ({ ...prev, side: value }));
                      }
                    }}
                    buttons={sideDinnerBtn}
                    style={styles.segmentsBtn}
                  />
                  {dinnerConfirm.side !== "" && (
                    <View style={styles.textConfirmDishes}>
                      <IconButton icon={"check"} iconColor="limegreen" />
                      <Text>{dinnerConfirm.side}</Text>
                    </View>
                  )}
                  <Button
                    icon={"database-plus-outline"}
                    buttonColor="dodgerblue"
                    textColor="aliceblue"
                    mode="elevated"
                    style={styles.saveBtn}
                    onPress={() => handleSaveDinner(dinnerConfirm)}
                  >
                    Save
                  </Button>

                  <Button
                    icon={"food-drumstick-off-outline"}
                    buttonColor="red"
                    textColor="aliceblue"
                    mode="elevated"
                    style={styles.saveBtn}
                    onPress={handleSaveNoDinner}
                  >
                    I don't want anything
                  </Button>
                </View>
              ) : (
                <View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <IconButton
                      icon={"check"}
                      iconColor="limegreen"
                      style={{ backgroundColor: "aliceblue" }}
                    />

                    <Text>Dinner Saved!</Text>
                  </View>
                  <Divider style={{ marginVertical: 20 }} />

                  <View style={styles.dinnerChoices}>
                    <View>
                      <Text style={styles.titleChoice}>First Dish</Text>
                      <Text>{userDb.dinner[date]?.firstDish}</Text>
                    </View>
                    <View>
                      <Text style={styles.titleChoice}>Second Dish</Text>
                      <Text>{userDb.dinner[date]?.secondDish}</Text>
                    </View>
                    <View>
                      <Text style={styles.titleChoice}>Side Dish</Text>
                      <Text>{userDb.dinner[date]?.side}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: "lightgrey",
  },
  section: {
    color: "grey",
    textTransform: "capitalize",
  },
  saveButton: {
    height: 60,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: (width * 95) / 100,
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
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  titleDishes: {
    color: "dodgerblue",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "flex-start",
  },
  saveBtn: {
    marginTop: 20,
  },
  dinnerChoices: {
    justifyContent: "flex-start",
    alignItems: "flex-start",

    width: (width * 80) / 100,
  },
  titleChoice: {
    color: "dodgerblue",
    fontWeight: "bold",
    fontSize: 16,
  },
  titleMenu: {
    textAlign: "center",
    color: "slategray",
    fontSize: 20,
  },
  textConfirmDishes: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  segmentsBtn: {
    marginVertical: 10,
    width: (width * 90) / 100,
  },
});

export default CalendarUser;
