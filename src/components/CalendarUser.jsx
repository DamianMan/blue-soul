import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Agenda } from "react-native-calendars";

import AgendaItem from "./AgendaItem";
import { useContext } from "react";
import { ContextData } from "../context/ContextDataProvider";
import auth from "@react-native-firebase/auth";
import { Button } from "react-native-paper";
import axios from "axios";

const { height, width } = Dimensions.get("window");

// Example agenda data
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
    const newValues = value.map((item) =>
      programs.find((pr) => item === pr._id)
    );
    transformedData[key] = value;
  }
  return transformedData;
};

function CalendarUser(props) {
  const { programs, groups, users, getGroups, loading } =
    useContext(ContextData);

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const user = auth().currentUser;
  const userDb = users.find((item) => item.email === user.email);
  console.log("USER PROGRAM:", userDb.program);

  const currentGroup = groups.find(
    (item) => item.tokenGroup === userDb.tokenGroup
  );
  const idGroup = currentGroup?._id;

  const { program } = currentGroup;
  const [date, setDate] = useState(formattedDate);
  const [items, setItems] = useState(
    ITEMS(programs, userDb.program || program)
  );
  const [value, setValue] = useState([]);
  const [noOption, setNoOption] = useState(false);
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={"dodgerblue"} />
      </View>
    );
  }

  const handleSave = async () => {
    try {
      console.log("List:", value);

      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postDailyProgramByUser",
          { idGroup, date, value },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
          setSaved((prev) => !prev);
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      alert("Error making request to update program by user!");
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
          onPress={handleSave}
        >
          Pick You Dinner
        </Button>
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
});

export default CalendarUser;
