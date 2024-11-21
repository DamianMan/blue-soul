import React, { useContext, useState } from "react";
import { Dimensions, View } from "react-native";
import { Agenda } from "react-native-calendars";
import AgendaItemAdmin from "./AgendaItemAdmin";
import { Button } from "react-native-paper";

const { width } = Dimensions.get("window");

function CalendarAdmin({ agendaList, setModalVisible, idGroup }) {
  const today = new Date();
  const [date, setDate] = useState();

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
        date={today}
        items={agendaList}
        renderItem={(item) => (
          <AgendaItemAdmin item={item} idGroup={idGroup} date={date} />
        )}
        onDayPress={(day) => {
          setDate(day.dateString); // Updates state with the selected date
        }}
      />
    </View>
  );
}

export default CalendarAdmin;
