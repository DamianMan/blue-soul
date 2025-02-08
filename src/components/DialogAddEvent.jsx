import axios from "axios";
import { useState, useCallback, useContext } from "react";
import { StyleSheet, Text, Dimensions, Alert, Modal, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { de, registerTranslation } from "react-native-paper-dates";
import { ContextData } from "../context/ContextDataProvider";
import { API_KEY_PROTECTED } from "@env";
registerTranslation("de", de);

const { width } = Dimensions.get("window");

function DialogAddEvent({ visible, hideDialog }) {
  const { fetchData } = useContext(ContextData);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState({ hours: undefined, minutes: undefined });
  const [event, setEvent] = useState("");
  const [description, setDescription] = useState("");

  const onDismiss = useCallback(() => {
    setShowTimePicker(false);
  }, [setShowTimePicker]);

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      setTime((prev) => ({ ...prev, hours, minutes }));
      setShowTimePicker(false);

      console.log({ hours, minutes });
    },
    [setShowTimePicker]
  );

  const handleEventTitle = (event) => {
    setEvent(event);
  };

  const handleEventDescription = (event) => {
    setDescription(event);
  };
  const handleSave = async () => {
    const getHour = `${time.hours < 10 ? `0${time.hours}` : time.hours}:${
      time.minutes < 10 ? `0${time.minutes}` : time.minutes
    }`;
    const isOptional = false;
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postProgram",
          {
            getHour,
            event,
            isOptional,
            description,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY_PROTECTED,
            },
          }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
          fetchData();
          hideDialog();
        })
        .catch((res) => {
          Alert.alert(res.data.status, res.data.message);
        });
    } catch (error) {
      alert("Error making request adding event!");
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        hideDialog();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.conatiner}>
          <IconButton
            icon={"close"}
            mode="elevated"
            iconColor="#fff"
            containerColor={"red"}
            onPress={hideDialog}
            size={10}
            style={styles.closeBtn}
          />
          <View style={styles.dialogView}>
            <Button
              icon={"clock-time-nine-outline"}
              onPress={() => setShowTimePicker(true)}
              uppercase={false}
              mode="elevated"
              buttonColor="aliceblue"
              textColor="dodgerblue"
            >
              Pick time
            </Button>
            <TimePickerModal
              locale="de"
              visible={showTimePicker}
              onDismiss={onDismiss}
              onConfirm={onConfirm}
              hours={12}
              minutes={14}
              use24HourClock={true}
              defaultInputType={"keyboard"}
            />
            {time.hours && (
              <>
                <Text style={{ fontWeight: "bold", marginTop: 20 }}>HOUR</Text>
                <Text>
                  {time.hours < 10 ? `0${time.hours}` : time.hours}:
                  {time.minutes < 10 ? `0${time.minutes}` : time.minutes}
                </Text>
                <TextInput
                  label="Event Title"
                  value={event}
                  style={styles.input}
                  textColor="#000"
                  activeUnderlineColor="dodgerblue"
                  onChangeText={handleEventTitle}
                />
                <TextInput
                  label="Description"
                  value={description}
                  style={styles.input}
                  textColor="#000"
                  activeUnderlineColor="dodgerblue"
                  onChangeText={handleEventDescription}
                />
                <Button
                  icon={"database-plus-outline"}
                  buttonColor="dodgerblue"
                  textColor="aliceblue"
                  mode="elevated"
                  onPress={handleSave}
                  style={{ fontWeight: "bold", marginTop: 10 }}
                >
                  Save Event
                </Button>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  conatiner: {
    width: (width * 90) / 100,

    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 55,
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

  input: {
    width: (width * 80) / 100,
    marginVertical: 20,
    backgroundColor: "aliceblue",
  },
});

export default DialogAddEvent;
