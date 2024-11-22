import React, { useRef, useCallback } from "react";
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from "react-native";
import {
  Agenda,
  DateData,
  AgendaEntry,
  AgendaSchedule,
} from "react-native-calendars";

import AgendaItem from "./AgendaItem";
import { useContext } from "react";
import { ContextData } from "../context/ContextDataProvider";
import auth from "@react-native-firebase/auth";

const { height, width } = Dimensions.get("window");

// Example agenda data
const ITEMS = (programs, data) => {
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
    data[key] = newValues;
  }
  return data;
};

function CalendarUser(props) {
  const { programs, groups, users } = useContext(ContextData);
  const today = new Date();
  const user = auth().currentUser;
  const userDb = users.find((item) => item.email === user.email);
  const currentGroup = groups.find(
    (item) => item.tokenGroup === userDb.tokenGroup
  );
  const { program } = currentGroup;

  return (
    <SafeAreaView style={{ flex: 1, width }}>
      <Agenda
        date={today}
        showOnlySelectedDayItems={true}
        items={ITEMS(programs, program)}
        renderItem={(item) => <AgendaItem item={item} />}
      />
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
});

export default CalendarUser;
