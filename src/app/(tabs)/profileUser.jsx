import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Button, TextInput, Checkbox, Surface } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import auth from "@react-native-firebase/auth";
import EditPAsswordModal from "../../components/EditPasswordModal";
const { width, height } = Dimensions.get("window");

function addNewUser(props) {
  const user = auth().currentUser;

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [modalPassword, setModalPassword] = useState(false);

  const validateEmail = (text) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailPattern.test(text));
  };

  const [infoGroup, setInfoGroup] = useState({
    fullName: user?.displayName || "",
    address: "",
    email: user.email || "",
    newPassord: "",
    city: "",
    phone: "",
    id: false,
    passport: false,
    numDocument: "",
  });

  const handleEmail = (text) => {
    validateEmail(text);
    setInfoGroup({ ...infoGroup, email: text });
  };

  const updatePassword = async () => {
    try {
      if (user) {
        await user.updatePassword(infoGroup.newPassord);
        alert("Password updated");
      } else {
        alert("No user authenticated!");
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleOpenModal = () => {
    setModalPassword(!modalPassword);
  };

  return (
    <View>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1516149893016-813d9a01d5d3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.background}
        resizeMode="cover"
      ></ImageBackground>

      <View style={{ paddingHorizontal: 20, marginVertical: 30 }}>
        <Text style={styles.title}>Registration</Text>
        <Text style={styles.subtitle}>
          Fill all the fields with your personal info
        </Text>
      </View>
      <View style={styles.form}>
        <TextInput
          value={infoGroup.fullName}
          mode="outlined"
          textColor="#ff5f00"
          activeOutlineColor="#121481"
          label="Full Name"
          onChangeText={(text) =>
            setInfoGroup({ ...infoGroup, fullName: text })
          }
          style={styles.userInput}
          autoCorrect={false} // Disables auto-correct
          autoCapitalize="none" // Disables auto-capitalization
          keyboardType="default" // Sets keyboard to default
          textContentType="none"
        />
        <TextInput
          value={infoGroup.address}
          mode="outlined"
          textColor="#ff5f00"
          activeOutlineColor="#121481"
          label="Address"
          onChangeText={(text) => setInfoGroup({ ...infoGroup, address: text })}
          style={styles.userInput}
        />

        <TextInput
          value={infoGroup.city}
          mode="outlined"
          textColor="#ff5f00"
          activeOutlineColor="#121481"
          label="City"
          onChangeText={(text) => setInfoGroup({ ...infoGroup, city: text })}
          style={styles.userInput}
        />
        <TextInput
          value={infoGroup.email}
          mode="outlined"
          textColor="#ff5f00"
          activeOutlineColor="#121481"
          label="Email"
          error={!isValidEmail}
          onChangeText={handleEmail}
          style={styles.userInput}
        />
        <TextInput
          value={infoGroup.phone}
          mode="outlined"
          textColor="#ff5f00"
          activeOutlineColor="#121481"
          label="Phone numer"
          placeholder="+49 69 1234 5678"
          onChangeText={(text) => setInfoGroup({ ...infoGroup, phone: text })}
          style={styles.userInput}
        />
        <Surface elevation={5} style={[styles.surface, { marginTop: 5 }]}>
          <Checkbox.Item
            color="lime"
            label="ID"
            status={infoGroup.id ? "checked" : "unchecked"}
            onPress={() =>
              setInfoGroup((prev) => ({
                ...prev,
                id: !prev.id,
                passport: false,
              }))
            }
          />
        </Surface>
        <Surface elevation={5} style={styles.surface}>
          <Checkbox.Item
            color="lime"
            label="Passport"
            status={infoGroup.passport ? "checked" : "unchecked"}
            onPress={() =>
              setInfoGroup((prev) => ({
                ...prev,
                passport: !prev.passport,
                id: false,
              }))
            }
          />
        </Surface>

        {(infoGroup.id || infoGroup.passport) && (
          <TextInput
            value={infoGroup.numDocument}
            mode="outlined"
            textColor="#ff5f00"
            activeOutlineColor="#121481"
            label={`Numer ${
              (infoGroup.id && "ID") || (infoGroup.passport && "Passport")
            }`}
            onChangeText={(text) =>
              setInfoGroup({ ...infoGroup, numDocument: text })
            }
            style={styles.userInput}
          />
        )}

        <View
          style={{
            width: width,
            paddingHorizontal: 20,
            paddingTop: 30,
          }}
        >
          <Button
            mode="elevated"
            labelStyle={{ color: "#ffff", fontSize: 15 }}
            icon={({ size, color }) => (
              <AntDesign name="edit" size={30} color="#fff" /> // Custom icon color
            )}
            style={styles.editPAsswordBtn}
            onPress={() => setModalPassword(!modalPassword)}
          >
            Edit Password
          </Button>
          <EditPAsswordModal
            modalVisible={modalPassword}
            setModalVisible={handleOpenModal}
          />
          <Button
            mode="elevated"
            labelStyle={{ color: "#ffff", fontSize: 15 }}
            icon={({ size, color }) => (
              <Icon name="database-plus" size={30} color="#fff" /> // Custom icon color
            )}
            style={styles.submitBtn}
            onPress={() => console.log("Submitted")}
          >
            Submit
          </Button>
        </View>
      </View>
    </View>
  );
}

export default addNewUser;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
    opacity: 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "midnightblue",
    textAlign: "start",
  },

  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "steelblue",
    textAlign: "start",
  },
  submitBtn: {
    backgroundColor: "#3572EF",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 3,
  },
  editPAsswordBtn: {
    backgroundColor: "orangered",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 3,
  },
  userInput: {
    width: (width * 90) / 100,
    borderRadius: 10,
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
  },
  surface: {
    marginVertical: 3,
    borderRadius: 5,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "lightcyan",
    opacity: 0.8,
    marginLeft: 20,
  },
});
