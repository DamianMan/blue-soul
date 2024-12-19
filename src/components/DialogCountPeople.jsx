import { StyleSheet, Modal, View, Text } from "react-native";
import { Button, IconButton } from "react-native-paper";
import PdfButton from "./PdfButton";

function DialogCountPeople({
  visible,
  hideDialog,
  count,
  total,
  event,
  peopleList,
}) {
  console.log("visibile:", visible);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={hideDialog}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <IconButton
            icon={"close-circle-outline"}
            iconColor="red"
            onPress={hideDialog}
            style={styles.closeBtn}
          />
          <Text style={styles.title}>Event</Text>
          <Text>{event}</Text>

          <Text style={styles.title}>Total People</Text>
          <Text>
            {count}/{total}
          </Text>
          <View style={{ marginTop: 20 }}>
            <PdfButton
              currentUsers={peopleList}
              textBtn={"Confirmed People PDF"}
              event={event}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "dodgerblue",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
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
});

export default DialogCountPeople;
