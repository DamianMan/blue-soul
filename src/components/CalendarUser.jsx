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
import { Button, IconButton, SegmentedButtons } from "react-native-paper";
import axios from "axios";

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
const ITEMS = (programs, data) => {
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
    transformedData[key] = value;
  }
  return transformedData;
};

function CalendarUser(props) {
  const { programs, groups, users, getGroups, getUsers, loading, fetchData } =
    useContext(ContextData);

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
  console.log("Dinner :", currentGroup.dinner[date]);

  const [items, setItems] = useState(
    ITEMS(programs, userDb.program || program)
  );
  const [value, setValue] = useState([]);
  const [noOption, setNoOption] = useState(false);
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);
  const [dinnerModal, setDinnerModal] = useState(false);
  const [firstDinnerBtn, setFirstDinnerBtn] = useState([]);
  const [secondDinnerBtn, setSecondDinnerBtn] = useState([]);
  const [sideDinnerBtn, setSideDinnerBtn] = useState([]);

  const [dinnerConfirm, setDinnerConfirm] = useState({
    firstDish: "",
    secondDish: "",
    side: "",
  });

  if (loading) {
    return <Loader />;
  }

  const createDinnerBtnsValues = (obj, type) => {
    const newList = obj[type].map((item) => ({ value: item, label: item }));
    return newList;
  };

  const handleSave = async () => {
    console.log("VALUES:", value);
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postDailyProgramByUser",
          { email, date, value },
          {
            headers: {
              "Content-Type": "application/json",
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

  const handleSaveDinner = async () => {
    const idUser = userDb._id;
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postUserDinner",
          {
            idUser,
            date,
            dinnerConfirm,
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
        .catch((res) => {
          Alert.alert(res.data.status, res.data.message);
        });
    } catch (error) {
      alert("Error making request posting user dinner!");
    }
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
          if (currentGroup.dinner.hasOwnProperty(day.dateString)) {
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
            style={styles.saveButton}
            onPress={handleSave}
          >
            Save Program
          </Button>
        )}
        <Button
          icon={"food-fork-drink"}
          textColor="dodgerblue"
          mode="elevated"
          buttonColor="#fff"
          style={styles.saveButton}
          onPress={toogleDinnerModal}
        >
          Pick You Dinner
        </Button>
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

              {/* FIRST DISHES */}
              <Text style={styles.titleDishes}>First Dishes</Text>

              <SegmentedButtons
                value={dinnerConfirm.firstDish}
                onValueChange={(value) =>
                  setDinnerConfirm((prev) => ({ ...prev, firstDish: value }))
                }
                buttons={firstDinnerBtn}
                style={{
                  paddingVertical: 20,
                  width: (width * 90) / 100,
                }}
              />
              {dinnerConfirm.firstDish !== "" && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <IconButton icon={"check"} iconColor="limegreen" />
                  <Text>{dinnerConfirm.firstDish}</Text>
                </View>
              )}
              {/* SECOND DISHES */}
              <Text style={styles.titleDishes}>Second Dishes</Text>

              <SegmentedButtons
                value={dinnerConfirm.secondDish}
                onValueChange={(value) =>
                  setDinnerConfirm((prev) => ({ ...prev, secondDish: value }))
                }
                buttons={secondDinnerBtn}
                style={{
                  paddingVertical: 20,
                  width: (width * 90) / 100,
                }}
              />
              {dinnerConfirm.secondDish !== "" && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <IconButton icon={"check"} iconColor="limegreen" />
                  <Text>{dinnerConfirm.secondDish}</Text>
                </View>
              )}
              {/* SIDE DISHES */}
              <Text style={styles.titleDishes}>Side Dishes</Text>

              <SegmentedButtons
                value={dinnerConfirm.side}
                onValueChange={(value) =>
                  setDinnerConfirm((prev) => ({ ...prev, side: value }))
                }
                buttons={sideDinnerBtn}
                style={{
                  paddingVertical: 20,
                  width: (width * 90) / 100,
                }}
              />
              {dinnerConfirm.side !== "" && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                onPress={handleSaveDinner}
              >
                Save
              </Button>
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
});

export default CalendarUser;
