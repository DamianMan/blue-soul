import { useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { useContext } from "react";
import { de, registerTranslation } from "react-native-paper-dates";
import { ContextData } from "../context/ContextDataProvider";
registerTranslation("de", de);

function FilterDatesForm({ setFilteredGroups, setMessage }) {
  const { groups } = useContext(ContextData);
  // Date Picker   const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });
  const [date, setDate] = useState(undefined);

  const [open, setOpen] = useState(false);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    (params) => {
      setOpen(false);
      DateIn(params.date, setDate);
    },
    [setOpen, setDate]
  );

  // Check if DATE in range
  const DateIn = (selectedDate, setDate) => {
    const filteredGroups = groups.filter((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      if (item.startDate || item.endDate) {
        if (selectedDate >= startDate && selectedDate <= endDate) {
          return item;
        }
      }
    });
    console.log("Filtered GROUPS:", filteredGroups);
    if (filteredGroups.length > 0) {
      setFilteredGroups(filteredGroups);
      setDate(selectedDate);
    } else {
      alert(`No Groups In Date: ${selectedDate.toLocaleDateString("de-DE")}`);
    }
  };

  return (
    <>
      <Button
        onPress={() => setOpen(true)}
        uppercase={false}
        mode="elevated"
        buttonColor="lightseagreen"
        textColor="aliceblue"
        icon={"calendar"}
        style={{ borderRadius: 5, padding: 5, margin: 15 }}
      >
        Click To Filter Groupds By Date
      </Button>
      <DatePickerModal
        locale="de"
        mode="single"
        visible={open}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
      />
      <View style={styles.dateView}>
        {date && <Text style={{ color: "#2185D5" }}>Groups In Date</Text>}

        <Text style={styles.text}>
          {date && date.toLocaleDateString("de-De")}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: "lightseagreen",
    marginVertical: 3,
    borderRadius: 3,
  },
  dateView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin: 15,
  },
  text: {
    color: "#2185D5",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default FilterDatesForm;
