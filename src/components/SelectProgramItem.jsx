import { useContext, useEffect, useState } from "react";
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
import DropdownItem from "./DropdownItem";

const { height, width } = Dimensions.get("window");

const data = [
  { label: "White", value: "white" },
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
];
function SelectProgramItem({ date, setProgramGroup, programGroup, index }) {
  useEffect(() => {
    const dataPrograms = () => {
      const newArray = programs.map((item) => ({
        label: `${item.hour} - ${item.title}`,
        value: item,
      }));
      console.log("DATA ARRAY:", newArray);
      setData(newArray);
    };
    dataPrograms();
  }, [data]);

  const formattedDate = date.toISOString().slice(0, 10);

  const [selected, setSelected] = useState([]);
  const [obj, setObj] = useState([]);
  const { programs } = useContext(ContextData);
  const [isFocus, setIsFocus] = useState(false);
  const [itemOptional, setItemOptional] = useState([]);
  const [data, setData] = useState();

  const toogleIsOptional = (check, itemId) => {
    if (check) {
      const newArray = [...itemOptional, itemId];
      console.log("Added in List Optional:", newArray);
      setItemOptional(newArray);
    } else {
      const filteredArray = itemOptional.filter((elem) => elem !== itemId);
      console.log("Removed from List Optional:", filteredArray);

      setItemOptional(filteredArray);
    }
  };

  const editData = () => {
    const newData = data.map((item) => {
      if (itemOptional.includes(item.value._id)) {
        return {
          ...item,
          value: { ...item.value, isOptional: !item.value.isOptional },
        };
      } else {
        return item;
      }
    });
    console.log("EDIT DATA:", newData);
    setData(newData);
  };

  const handleBlur = () => {
    setIsFocus(false);
    console.log("OBj Item:", obj);
    console.log("List CHECK:", itemOptional);
    const newObj = obj.map((elem) => {
      if (itemOptional.includes(elem._id)) {
        console.log("Elem found!");
        return { ...elem, isOptional: !elem.isOptional, isConfirmed: false };
      } else {
        console.log("Elem NOT found!");
        return elem;
      }
    });
    // editData(); // Edit data in Multiselect

    const newObject = { ...programGroup, [formattedDate]: newObj };
    console.log("New object:", newObject);

    setProgramGroup(newObject);
  };

  const handleChange = (item) => {
    console.log("Selecete Item:", item);

    setSelected(item);
    setObj(item);
    setIsFocus(false);
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
        mode="modal"
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Select program"
        searchPlaceholder="Search..."
        onFocus={() => setIsFocus(true)}
        onBlur={handleBlur}
        value={selected}
        onChange={(item) => handleChange(item)}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "dodgerblue" : "gray"}
            name="Safety"
            size={20}
          />
        )}
        selectedStyle={styles.selectedStyle}
        renderItem={(item) => (
          <DropdownItem
            item={item}
            toggleOption={toogleIsOptional}
            itemOptional={itemOptional}
          />
        )}
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
