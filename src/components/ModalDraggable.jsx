import {
  NestableScrollContainer,
  NestableDraggableFlatList,
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { useContext, useState, useEffect } from "react";
import { ContextData } from "../context/ContextDataProvider";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import axios from "axios";
import { API_KEY_PROTECTED } from "@env";

const { width, height } = Dimensions.get("window");

function ModalDraggable({
  setIsDraggableModal,
  isDraggableModal,
  draggableList,
  idGroup,
  tokenGroup,
  date,
  setIsModal,
  isModal,
  value,
  usersFilterdeByGroup,
}) {
  console.log("Value Drag:", value);
  useEffect(() => {
    setData(draggableList);
    // const checkItemIn = () => {
    //   usersFilterdeByGroup.forEach((i) => {
    //     Object.entries(i.program).forEach(([key, item]) => {
    //       console.log("item:", item);
    //       const isValueIn = item.find((elem) => elem._id === value._id);
    //       if (isValueIn) {
    //         setDateUSerItem(key);
    //         setItemInUserAgenda(isValueIn);
    //       }
    //       console.log(`Elem found in date ${key}:`, isValueIn);
    //     });
    //   });
    // };
    // value && checkItemIn();
  }, [draggableList]);

  const { fetchData } = useContext(ContextData);
  const [data, setData] = useState(draggableList);
  const [itemInUserAgenda, setItemInUserAgenda] = useState();
  const [dateUsetItem, setDateUSerItem] = useState(date);

  async function onReordered(fromIndex, toIndex) {
    const copy = [...data]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    console.log("Re-Ordered List:", copy);
    setData(copy);
  }

  const handleDragSave = async () => {
    console.log(`User item in date ${dateUsetItem}`, value);

    console.log(`"NEW ARRAY:" in date ${date}`, tokenGroup);
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/addProgramDayDrag",
          {
            idGroup,
            tokenGroup,
            date,
            data,
            value,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY_PROTECTED,
            },
          }
        )
        .then((res) => {
          setIsDraggableModal(!isDraggableModal);
          setIsModal(!isModal);
          fetchData();
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      alert("Error adding request!");
    }
  };

  function renderItem(info) {
    const { item, onDragStart, onDragEnd, isActive } = info;

    return (
      <TouchableOpacity
        key={item}
        onPressIn={onDragStart}
        onPressOut={onDragEnd}
      >
        <View style={styles.item}>
          <Text style={styles.itemTitleText}>{item.hour}</Text>
          <Text style={styles.itemDurationText}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <Modal
      animationType="fullscreen"
      visible={isDraggableModal}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setIsDraggableModal(!isDraggableModal);
      }}
    >
      <View style={styles.modalView}>
        <View style={{ marginTop: 30 }}>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Button
              icon={"database-edit-outline"}
              mode="outlined"
              textColor="dodgerblue"
              onPress={handleDragSave}
            >
              Save
            </Button>
            <Button
              icon="close"
              mode="outlined"
              textColor="red"
              onPress={() => setIsDraggableModal(!isDraggableModal)}
            >
              Close
            </Button>
          </View>
          <Text
            style={{
              paddingTop: 120,
              color: "dodgerblue",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Please adjust the order as you need to be displayed, by dragging and
            dropping the program.
          </Text>
          <Text
            style={{
              paddingTop: 10,
              color: "gray",
              fontSize: 16,
            }}
          >
            Don't forget to save or the edit won't be displayed!
          </Text>

          <DragList
            data={data}
            keyExtractor={(item) => item._id}
            onReordered={onReordered}
            renderItem={renderItem}
            style={{ paddingTop: 30 }}
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 45,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonClose: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  buttonSave: {
    position: "absolute",
    left: 10,
    top: 20,
  },
  item: {
    padding: 20,
    backgroundColor: "aliceblue",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  itemHourText: {
    color: "black",
  },
  itemDurationText: {
    color: "#393E46",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
});

export default ModalDraggable;
