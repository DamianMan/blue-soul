import {
  StyleSheet,
  Modal,
  View,
  Text,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import PdfButton from "./PdfButton";

const { height, width } = Dimensions.get("window");

function DialogCountPeople({
  visible,
  hideDialog,
  count,
  total,
  events,
  peopleList,
}) {
  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
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
          <FlatList
            data={events}
            contentContainerStyle={styles.centeredView}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.itemView}>
                <Text style={styles.title}>Event</Text>
                <Text>{item}</Text>

                <Text style={styles.title}>Confirmed People</Text>
                <Text>
                  {peopleList[item].length}/{total}
                </Text>
                <View style={{ marginTop: 20 }}>
                  <PdfButton
                    currentUsers={peopleList[item]}
                    textBtn={`PDF for "${item}"`}
                    event={item}
                  />
                </View>
              </View>
            )}
          />
          <View style={{ alignSelf: "center", alignItems: "center" }}>
            <Text style={styles.title}>Total</Text>
            <Text>
              {count}/{total}
            </Text>
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
    top: Platform.OS === "ios" ? 40 : 0,
  },
  itemView: {
    marginVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

export default DialogCountPeople;
