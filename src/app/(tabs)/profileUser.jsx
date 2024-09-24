import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button, TextInput, Checkbox, Surface } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import auth from "@react-native-firebase/auth";
import EditPAsswordModal from "../../components/EditPasswordModal";
const { width, height } = Dimensions.get("window");
import { ContextData } from "../../context/ContextDataProvider";
import axios from "axios";

function profileUser(props) {
  const { users, getUsers } = useContext(ContextData);

  useEffect(() => {
    getUsers();
  }, []);
  let user = auth().currentUser;
  let currentUser = users.find(
    (stud) => stud.email === (user ? user.email : "")
  );

  currentUser = currentUser === undefined ? false : currentUser;
  user = user === undefined ? false : user;

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [modalPassword, setModalPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [infoGroup, setInfoGroup] = useState({
    fullName: user?.displayName || "",
    address: currentUser.address || "",
    email: user?.email || "",
    newPassord: "",
    city: currentUser.city || "",
    phone: currentUser.phone || "",
    id: currentUser.isId || false,
    passport: currentUser.isPassport || false,
    numDocument: currentUser.numDocument || "",
  });

  const validateEmail = (text) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailPattern.test(text));
  };

  const handleEmail = (text) => {
    validateEmail(text);
    setInfoGroup({ ...infoGroup, email: text });
  };

  const handleOpenModal = () => {
    setModalPassword(!modalPassword);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { address, city, phone, id, passport, numDocument } = infoGroup;
    console.log("ID:", id);
    console.log("Passport:", passport);

    try {
      await axios
        .post(
          "http://localhost:3000/api/updateUser",
          {
            fullName: user?.displayName,
            address,
            email: user?.email,
            city,
            phone,
            id,
            passport,
            numDocument,
          },
          {
            headers: {
              "Content-Type": "application/json", // Default for JSON payload
            },
          }
        )
        .then((response) => {
          setLoading(false);
          Alert.alert("Success", response.data.message);
        })
        .catch((err) => console.error("Error posting data:", err));
    } catch (error) {
      console.error("Error Initialing Request:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1516149893016-813d9a01d5d3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.background}
        resizeMode="cover"
      ></ImageBackground>
      {!loading ? (
        <View style={styles.form}>
          <View style={{ marginRight: 50, marginVertical: 30 }}>
            <Text style={styles.title}>Registration</Text>
            <Text style={styles.subtitle}>
              Fill all the fields with your personal info.
            </Text>
            <Text style={styles.subtitle}>
              You can edit them whenever you want
            </Text>
          </View>
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
            autoCapitalize="none" // Disables auto-capitalization
            onChangeText={(text) =>
              setInfoGroup({ ...infoGroup, address: text })
            }
            style={styles.userInput}
          />

          <TextInput
            value={infoGroup.city}
            mode="outlined"
            textColor="#ff5f00"
            activeOutlineColor="#121481"
            autoCapitalize="none" // Disables auto-capitalization
            label="City"
            onChangeText={(text) => setInfoGroup({ ...infoGroup, city: text })}
            style={styles.userInput}
          />
          <TextInput
            value={infoGroup.email}
            mode="outlined"
            textColor="#ff5f00"
            activeOutlineColor="#121481"
            autoCapitalize="none" // Disables auto-capitalization
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
              autoCapitalize="none" // Disables auto-capitalization
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
              onPress={handleSubmit}
            >
              Submit
            </Button>
          </View>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </ScrollView>
  );
}

export default profileUser;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
