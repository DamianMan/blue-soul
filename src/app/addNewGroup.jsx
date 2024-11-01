import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import "react-native-get-random-values"; // Import this first
import { v4 as uuidv4 } from "uuid";
const { width } = Dimensions.get("window");
import auth from "@react-native-firebase/auth";
import * as Clipboard from "expo-clipboard";
import axios from "axios";
import { ContextData } from "../context/ContextDataProvider";

function addNewGroup(props) {
  const user = auth().currentUser;
  const { getGroups } = useContext(ContextData);

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
  });
  const [loading, setLoading] = useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(infoGroup.token);
  };

  const signUp = async () => {
    setLoading(true);

    try {
      await auth()
        .createUserWithEmailAndPassword(infoGroup.email, infoGroup.token)
        .then((cred) => {
          cred.user.updateProfile({
            displayName: infoGroup.fullName,
          });
          auth().signOut();
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
      // Update the user's profile with the display name
      // await auth().signOut();
    } catch (error) {
      alert(error);
    }
  };

  const handleToken = () => {
    const newToken = uuidv4();

    setInfoGroup({ ...infoGroup, token: newToken });
  };

  const handleSubmit = async () => {
    const { name, fullName, email, token, city, phone } = infoGroup;
    setLoading(true);
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
              },
              {
                headers: { "Content-Type": "application/json" },
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
              }));
              // signUp();
              getGroups();

              setLoading(false);
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
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "#303841",
          fontSize: 18,
          paddingBottom: 10,
          textAlign: "left",
          paddingRight: 20,
        }}
      >
        Please fill all the fields with the info group
      </Text>
      {!loading ? (
        <View style={styles.form}>
          <TextInput
            value={infoGroup.name}
            mode="outlined"
            textColor="#3A4750"
            activeOutlineColor="#2185D5"
            autoCapitalize="none"
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
            autoCapitalize="none"
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
                <MaterialIcons name="content-copy" size={24} color="#2185D5" />
              )}
              mode="contained-total"
              labelStyle={{
                color: "#2185D5",
                fontSize: 14,
              }}
              style={styles.generateBtn}
              onPress={copyToClipboard}
            >
              <Text>{infoGroup.token}</Text>
            </Button>
          )}
        </View>
      ) : (
        <ActivityIndicator />
      )}

      <View
        style={{
          flex: 1,
          width: width,
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
      >
        <Button
          mode="elevated"
          labelStyle={{ color: "#ffff", fontSize: 15 }}
          icon={({ size, color }) => (
            <Icon name="database-plus" size={30} color="#fff" /> // Custom icon color
          )}
          style={styles.submitBtn}
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </View>
    </View>
  );
}

export default addNewGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "#F3F3F3",
  },
  copiedText: {
    marginTop: 10,
    color: "red",
  },

  userInput: {
    width: (width * 90) / 100,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#3572EF",
    shadowOffset: {
      width: 3,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1.65,

    elevation: 2,
    marginBottom: 5,
  },
  submitBtn: {
    backgroundColor: "#3572EF",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    marginTop: "auto",
  },
  generateBtn: {
    backgroundColor: "orangered",
    marginVertical: 5,
    borderRadius: 5,
    height: 50,
    width: (width * 90) / 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
