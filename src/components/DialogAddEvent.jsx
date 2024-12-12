import axios from "axios";
import { useState, useCallback } from "react";
import { StyleSheet, Text, Dimensions, Alert } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { de, registerTranslation } from "react-native-paper-dates";
registerTranslation("de", de);

const { width } = Dimensions.get("window");

function DialogAddEvent({ visible, hideDialog }) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState({ hours: undefined, minutes: undefined });
  const [event, setEvent] = useState("");

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

  const handleEvent = (event) => {
    setEvent(event);
  };

  const handleSave = async () => {
    const getHour = `${time.hours < 10 ? `0${time.hours}` : time.hours}:${
      time.minutes < 10 ? `0${time.minutes}` : time.minutes
    }`;
    const isOptional = false;
    alert(getHour);
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postProgram",
          {
            getHour,
            event,
            isOptional,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
        })
        .catch((res) => {
          Alert.alert(res.data.status, res.data.message);
        });
    } catch (error) {
      alert("Error making request adding event!");
    }
  };
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={styles.conatiner}>
        <IconButton
          icon={"close"}
          mode="elevated"
          iconColor="#fff"
          containerColor={"red"}
          onPress={hideDialog}
          size={10}
          style={styles.closeBtn}
        />
        <Dialog.Content style={styles.dialogView}>
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
                label="Event"
                value={event}
                style={styles.input}
                textColor="#000"
                activeUnderlineColor="dodgerblue"
                onChangeText={handleEvent}
              />
              <Button
                icon={"database-plus-outline"}
                buttonColor="dodgerblue"
                textColor="aliceblue"
                mode="elevated"
                onPress={handleSave}
                style={{ fontWeight: "bold", marginTop: 10 }}
              >
                Save
              </Button>
            </>
          )}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: "#fff",
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    right: 20,
    top: 0,
  },
  dialogView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: (width * 80) / 100,
    marginVertical: 20,
    backgroundColor: "aliceblue",
  },
});

export default DialogAddEvent;
