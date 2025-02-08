import { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import "react-native-get-random-values"; // Import this first
import { v4 as uuidv4 } from "uuid";
import auth from "@react-native-firebase/auth";
import * as Clipboard from "expo-clipboard";
import axios from "axios";
import { ContextData } from "../context/ContextDataProvider";
import { DatePickerModal } from "react-native-paper-dates";
import { de, registerTranslation } from "react-native-paper-dates";
import SelectProgramItem from "../components/SelectProgramItem";
import SetProgramsModal from "../components/SetProgramsModal";
import Loader from "../components/Loader";
import { API_KEY_PROTECTED } from "@env";
registerTranslation("de", de);

const { width, height } = Dimensions.get("window");

function addNewGroup(props) {
  const user = auth().currentUser;
  const { getGroups, fetchData, loading } = useContext(ContextData);

  const [isValidEmail, setIsValidEmail] = useState(true);
  const validateEmail = (text) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailPattern.test(text));
  };

  const [infoGroup, setInfoGroup] = useState({
    name: "",
    fullName: "",
    email: "",
    token: "",
    city: "",
    phone: "",
    numOfPeople: 0,
    hotel: "",
  });

  // Date Picker   const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });
  const [range, setRange] = useState({
    startDate: undefined,
    endDate: undefined,
  });
  const [open, setOpen] = useState(false);

  // Get Days in Date Range
  const getDaysInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    if (start > end) return dates;

    while (start <= end) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    // const objectProgram = dates.map((item) => {
    //   const date = item.toISOString().slice(0, 10);
    //   return { [date]: [] };
    // });
    const objectProgram = {};
    dates.forEach((item) => {
      const date = item.toISOString().slice(0, 10);
      objectProgram[date] = [];
    });
    console.log("Object:", objectProgram);
    setProgramGroup(objectProgram);
    return dates;
  };
  const [rangeSelected, setRangeSelected] = useState();

  // Setting Prgram Object per Group
  const [programGroup, setProgramGroup] = useState({});

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
      setRangeSelected(getDaysInRange(startDate, endDate));
    },
    [setOpen, setRange]
  );

  // Copy function
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(infoGroup.token);
  };

  const handleToken = () => {
    const newToken = uuidv4();

    setInfoGroup({ ...infoGroup, token: newToken });
  };

  const handleSubmit = async () => {
    const { name, fullName, email, token, city, phone, numOfPeople, hotel } =
      infoGroup;
    const { startDate, endDate } = range;
    if (infoGroup.token === "" || infoGroup.email === "") {
      Alert.alert("Error", "Please fill all field");
    } else if (!isValidEmail) {
      Alert.alert("Error", "Invalid email format");
    } else {
      try {
        if (user) {
          await axios
            .post(
              "https://blue-soul-app.onrender.com/api/postGroup",
              {
                name,
                fullName,
                email,
                token,
                city,
                phone,
                numOfPeople,
                startDate,
                endDate,
                programGroup,
                hotel,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": API_KEY_PROTECTED,
                },
              }
            )
            .then((res) => {
              Alert.alert("Success", res.data.message);
              setInfoGroup((prev) => ({
                ...prev,
                name: "",
                fullName: "",
                email: "",
                token: "",
                city: "",
                phone: "",
                hotel: "",
                numOfPeople: 0,
              }));
              setRange({ startDate: undefined, endDate: undefined });
              setProgramGroup([]);
              setRangeSelected();
              fetchData();
            })
            .catch((err) => alert(err));
        } else {
          alert("No User Authenticated");
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  const handleEmail = (text) => {
    validateEmail(text);
    setInfoGroup({ ...infoGroup, email: text });
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : height}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={{
            color: "#2185D5",
            fontSize: 18,
            letterSpacing: 1,
            paddingVertical: 10,
            fontWeight: "bold",
          }}
        >
          Fill all fields with info group
        </Text>
        <View style={styles.form}>
          <TextInput
            value={infoGroup.name}
            mode="outlined"
            textColor="#3A4750"
            activeOutlineColor="#2185D5"
            label="Group Name"
            onChangeText={(text) => setInfoGroup({ ...infoGroup, name: text })}
            style={styles.userInput}
          />
          <TextInput
            value={infoGroup.fullName}
            mode="outlined"
            textColor="#3A4750"
            activeOutlineColor="#2185D5"
            label="Full Name Teacher In Charge"
            onChangeText={(text) =>
              setInfoGroup({ ...infoGroup, fullName: text })
            }
            style={styles.userInput}
          />
          <TextInput
            value={infoGroup.email}
            mode="outlined"
            autoCapitalize="none"
            textColor="#3A4750"
            activeOutlineColor="#2185D5"
            label="Email"
            error={!isValidEmail}
            keyboardType="email-address"
            onChangeText={handleEmail}
            style={styles.userInput}
          />

          <TextInput
            value={infoGroup.city}
            mode="outlined"
            textColor="#3A4750"
            activeOutlineColor="#2185D5"
            label="City"
            onChangeText={(text) => setInfoGroup({ ...infoGroup, city: text })}
            style={styles.userInput}
          />
          <TextInput
            value={infoGroup.hotel}
            mode="outlined"
            textColor="#3A4750"
            activeOutlineColor="#2185D5"
            label="Hotel Name"
            onChangeText={(text) => setInfoGroup({ ...infoGroup, hotel: text })}
            style={styles.userInput}
          />
          <TextInput
            value={infoGroup.phone}
            autoCapitalize="none"
            mode="outlined"
            textColor="#3A4750"
            activeOutlineColor="#2185D5"
            label="Phone numer"
            placeholder="+49 69 1234 5678"
            onChangeText={(text) => setInfoGroup({ ...infoGroup, phone: text })}
            style={styles.userInput}
          />
          <TextInput
            value={infoGroup.numOfPeople}
            autoCapitalize="none"
            mode="outlined"
            textColor="#3A4750"
            activeOutlineColor="#2185D5"
            label="Number Of People"
            keyboardType="numeric"
            onChangeText={(num) =>
              setInfoGroup({ ...infoGroup, numOfPeople: num })
            }
            style={styles.userInput}
          />

          {infoGroup.token === "" ? (
            <Button
              icon={
                infoGroup.token === ""
                  ? () => <Icon name="barcode" size={30} color={"aliceblue"} />
                  : null
              }
              mode="contained-total"
              labelStyle={{
                color: "aliceblue",
                fontSize: 14,
              }}
              onPress={handleToken}
              style={styles.generateBtn}
            >
              {infoGroup.token === ""
                ? "Press to generate group code"
                : infoGroup.token}
            </Button>
          ) : (
            <Button
              icon={() => (
                <MaterialIcons
                  name="content-copy"
                  size={24}
                  color="aliceblue"
                />
              )}
              mode="contained-total"
              labelStyle={{
                color: "aliceblue",
                fontSize: 14,
              }}
              style={styles.generateBtn}
              onPress={copyToClipboard}
            >
              <Text>{infoGroup.token}</Text>
            </Button>
          )}
          <Button
            onPress={() => setOpen(true)}
            uppercase={false}
            mode="elevated"
            buttonColor="lightseagreen"
            textColor="aliceblue"
            style={{
              borderRadius: 5,
              padding: 5,
              marginTop: 5,
              width: (width * 90) / 100,
            }}
            icon={"calendar"}
          >
            {(!range.startDate || !range.endDate) && "Group Dates"}
            {range.startDate && (
              <Text>
                From{" "}
                <Text style={{ fontWeight: "bold", color: "#fff" }}>
                  {range.startDate.toLocaleDateString("de-De")}
                </Text>
              </Text>
            )}
            {range.endDate && (
              <Text>
                {" "}
                - To{" "}
                <Text style={{ fontWeight: "bold", color: "#fff" }}>
                  {range.endDate.toLocaleDateString("de-De")}
                </Text>
              </Text>
            )}
          </Button>
          <DatePickerModal
            locale="de"
            mode="range"
            visible={open}
            onDismiss={onDismiss}
            startDate={range.startDate}
            endDate={range.endDate}
            onConfirm={onConfirm}
          />

          {/* {range.startDate && range.endDate && (
            <SetProgramsModal
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
              startDate={range.startDate}
              endDate={range.endDate}
            />
          )} */}
          {rangeSelected && (
            <>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={rangeSelected}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => (
                  <SelectProgramItem
                    date={item}
                    index={index}
                    programGroup={programGroup}
                    setProgramGroup={setProgramGroup}
                  />
                )}
                style={{
                  alignSelf: "center",
                  padding: 1,
                  marginLeft: 10,
                  paddingBottom: 20,
                }}
              />
              <Button
                mode="elevated"
                labelStyle={{ color: "#ffff", fontSize: 15 }}
                icon={({ size, color }) => (
                  <Icon name="database-plus" size={30} color="#fff" /> // Custom icon color
                )}
                style={styles.submitBtn}
                onPress={handleSubmit}
              >
                Save
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default addNewGroup;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "#F3F3F3",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  copiedText: {
    marginTop: 10,
    color: "red",
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  userInput: {
    width: (width * 90) / 100,
    borderRadius: 10,
    backgroundColor: "#fff",

    marginBottom: 5,
  },
  submitBtn: {
    backgroundColor: "dodgerblue",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    padding: 5,
  },
  generateBtn: {
    backgroundColor: "steelblue",
    marginVertical: 5,
    borderRadius: 5,
    width: (width * 90) / 100,
    justifyContent: "center",
    alignItems: "center",
  },
  dateButton: {
    backgroundColor: "lightseagreen",
    marginVertical: 3,
    borderRadius: 3,
  },
  dateView: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
  },
});
