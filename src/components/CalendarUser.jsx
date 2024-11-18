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

const { height, width } = Dimensions.get("window");
// Example agenda data
const ITEMS = (programs) => {
  const data = {
    "2024-11-16": [
      { name: "Task1", title: "Hello World", hour: 9 },

      { name: "Task2", title: "Hello World", hour: 12 },
    ],
    "2024-11-17": [
      { name: "Task1", title: "Hello World", hour: 9 },
      { name: "Task2", title: "Hello World", hour: 12 },
    ],
    "2024-11-29": programs,
    "2024-11-18": programs,
    "2024-11-11": programs,
    "2024-11-30": programs,
    "2024-12-01": programs,
    "2024-12-06": programs,
    "2024-12-12": programs,
    "2024-12-08": programs,
    "2024-12-09": programs,
    "2024-12-20": programs,
  };
  return data;
};

function CalendarUser(props) {
  const { programs, groups } = useContext(ContextData);
  console.log("Programs:", programs);
  const today = new Date();

  return (
    <SafeAreaView style={{ flex: 1, width }}>
      <Agenda
        date={today}
        items={ITEMS(programs)}
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
