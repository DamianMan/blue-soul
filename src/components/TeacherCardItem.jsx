import { Avatar, Chip, IconButton } from "react-native-paper";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import GroupEditModal from "./GroupEditModal";
const { width } = Dimensions.get("window");

function TeacherCardItem({
  teacher,
  email,
  phone,
  city,
  token,
  numOfPeople,
  startDate,
  endDate,
  idGroup,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(token);
  };

  const startFormatDate = new Date(startDate);
  const endFormatDate = new Date(endDate);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };
  return (
    <View style={styles.teacherView}>
      <IconButton
        icon={"pencil"}
        iconColor="aliceblue"
        onPress={toggleModal}
        style={styles.editGroupBtn}
      />
      <GroupEditModal
        toggleModal={toggleModal}
        modalVisible={modalVisible}
        idGroup={idGroup}
      />
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingVertical: 15,
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.chipTextBold}>From</Text>
          <Text style={styles.chipText}>
            {startFormatDate.toLocaleDateString("de-DE")}
          </Text>
        </View>

        <Avatar.Image
          size={53}
          source={{
            uri: "https://img.freepik.com/vettori-gratuito/illustrazione-clipart-dell-insegnante-nero-disegnata-a-mano_23-2150923186.jpg?ga=GA1.1.609292962.1726606020&semt=ais_hybrid",
          }}
          style={{ backgroundColor: "lightcyan" }}
        />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.chipTextBold}>To</Text>
          <Text style={styles.chipText}>
            {endFormatDate.toLocaleDateString("de-DE")}
          </Text>
        </View>
      </View>
      <View>
        <Chip
          mode="outlined"
          elevated="true"
          icon={() => (
            <MaterialCommunityIcons
              name="account-supervisor-circle-outline"
              size={24}
              color="aliceblue"
              style={{ marginRight: 30 }}
            />
          )}
          style={styles.chip}
        >
          <Text style={styles.chipText}>{teacher}</Text>
        </Chip>
        <Chip
          mode="outlined"
          elevated="true"
          icon={() => (
            <MaterialCommunityIcons
              name="email"
              size={24}
              color="aliceblue"
              style={{ marginRight: 30 }}
            />
          )}
          style={styles.chip}
        >
          <Text style={styles.chipText}>{email}</Text>
        </Chip>
        <Chip
          mode="outlined"
          elevated="true"
          icon={() => (
            <MaterialCommunityIcons
              name="phone"
              size={24}
              color="aliceblue"
              style={{ marginRight: 30 }}
            />
          )}
          style={styles.chip}
        >
          <Text style={styles.chipText}>{phone}</Text>
        </Chip>
        <Chip
          mode="outlined"
          elevated="true"
          icon={() => (
            <MaterialCommunityIcons
              name="city"
              size={24}
              color="aliceblue"
              style={{ marginRight: 30 }}
            />
          )}
          style={styles.chip}
        >
          <Text style={styles.chipText}>{city}</Text>
        </Chip>
        <Chip
          mode="outlined"
          elevated="true"
          icon={() => (
            <MaterialCommunityIcons
              name="format-list-numbered"
              size={24}
              color="aliceblue"
              style={{ marginRight: 30 }}
            />
          )}
          style={styles.chip}
        >
          <Text style={styles.chipText}>{numOfPeople} People</Text>
        </Chip>

        <Chip
          mode="outlined"
          elevated="true"
          icon={() => (
            <MaterialCommunityIcons
              name="barcode"
              size={24}
              color="aliceblue"
              style={{ marginRight: 30 }}
            />
          )}
          style={styles.chip}
          onPress={copyToClipboard}
        >
          <Text style={styles.chipText}>Click To Copy Group Token</Text>
        </Chip>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  teacherView: {
    padding: 20,
    backgroundColor: "#3FA2F6",
    shadowColor: "#3A4750",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.61,
    shadowRadius: 9.11,

    elevation: 14,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  chip: {
    alignSelf: "center",
    width: (width * 85) / 100,
    padding: 5,
    marginVertical: 5,
    backgroundColor: "#0F67B1",
    color: "#fff",
    borderColor: "#3FA2F6",
  },
  chipText: {
    color: "#fff",
    fontSize: 16,
  },
  chipTextBold: {
    fontWeight: "bold",
    color: "#fff",
  },
  editGroupBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
export default TeacherCardItem;
