import React, { useRef, useCallback } from "react";
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from "react-native";
import {
  Agenda,
  DateData,
  AgendaEntry,
  AgendaSchedule,
} from "react-native-calendars";

import AgendaItem from "./AgendaItem";

const { height, width } = Dimensions.get("window");
// Example agenda data
const ITEMS = {
  "2024-11-16": [
    { name: "Task1", data: "Hello World", hour: "09:00" },

    { name: "Task2", data: "Hello World", hour: "12:00" },
  ],
  "2024-11-17": [
    { name: "Task1", data: "Hello World", hour: "09:00" },
    { name: "Task2", data: "Hello World", hour: "12:00" },
  ],
  "2024-11-29": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-11-18": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-11-11": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-11-30": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-12-01": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-12-06": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-12-12": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-12-08": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-12-09": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
  "2024-12-20": [{ name: "Task1", data: "Hello World", hour: "09:00" }],
};

function CalendarUser(props) {
  const today = new Date();

  return (
    <SafeAreaView style={{ flex: 1, width }}>
      <Agenda
        date={today}
        items={ITEMS}
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
