import { useContext, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { Button } from "react-native-paper";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ContextData } from "../context/ContextDataProvider";

const { height, width } = Dimensions.get("window");

const data = [
  { label: "White", value: "white" },
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
];
function SelectProgramItem({ date, setProgramGroup, programGroup, index }) {
  const formattedDate = date.toISOString().slice(0, 10);

  const [selected, setSelected] = useState([]);
  const [obj, setObj] = useState({});
  const { programs } = useContext(ContextData);
  const [isFocus, setIsFocus] = useState(false);
  const dataPrograms = () => {
    const newArray = programs.map((item) => ({
      label: `${item.hour} - ${item.title}`,
      value: item._id,
    }));
    return newArray;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.textDate}>{date.toLocaleDateString("de-De")}</Text>
      <MultiSelect
        style={[styles.dropdown, isFocus && { borderColor: "dodgerblue" }]}
        containerStyle={styles.containerStyle}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        visibleSelectedItem={false}
        activeColor="lightblue"
        search
        mode="modal"
        data={dataPrograms()}
        labelField="label"
        valueField="value"
        placeholder="Select program"
        searchPlaceholder="Search..."
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false);
          console.log("Date:", formattedDate);

          const newObject = { ...programGroup, [formattedDate]: obj };
          console.log("New object:", newObject);

          setProgramGroup(newObject);
        }}
        value={selected}
        onChange={(item) => {
          setSelected(item);
          setObj(item);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "dodgerblue" : "gray"}
            name="Safety"
            size={20}
          />
        )}
        selectedStyle={styles.selectedStyle}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    width: (width * 60) / 100,
    marginHorizontal: 8,
    height: 100,
    padding: 10,
    backgroundColor: "azure",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  textDate: { fontWeight: "bold" },
  buttonsView: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
  },
  button: {
    margin: 15,
  },

  dropdown: {
    height: 50,
    width: (width * 50) / 100,
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
    fontSize: 10,
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
});

export default SelectProgramItem;
