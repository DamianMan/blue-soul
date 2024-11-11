import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  const { users } = useContext(ContextData);

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
          "https://blue-soul-app.onrender.com/api/updateUser",
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <ImageBackground
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1683865775275-a576c7588bc8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHVzZXJ8ZW58MHx8MHx8fDA%3D",
          }}
          style={styles.background}
          resizeMode="cover"
        ></ImageBackground>
        {!loading ? (
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: 30,
              }}
            >
              <Text style={styles.title}>Registration</Text>
              <Text style={styles.subtitle}>
                Fill all the fields with your personal info.
              </Text>
              <Text style={styles.subtitle}>
                You can edit them whenever you want
              </Text>
            </View>
            <View style={styles.form}>
              <TextInput
                value={infoGroup.fullName}
                mode="outlined"
                textColor="#303841"
                activeOutlineColor="#2185D5"
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
                textColor="#303841"
                activeOutlineColor="#2185D5"
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
                textColor="#303841"
                activeOutlineColor="#2185D5"
                autoCapitalize="none" // Disables auto-capitalization
                label="City"
                onChangeText={(text) =>
                  setInfoGroup({ ...infoGroup, city: text })
                }
                style={styles.userInput}
              />
              <TextInput
                value={infoGroup.email}
                mode="outlined"
                textColor="#303841"
                activeOutlineColor="#2185D5"
                autoCapitalize="none" // Disables auto-capitalization
                label="Email"
                error={!isValidEmail}
                onChangeText={handleEmail}
                style={styles.userInput}
              />
              <TextInput
                value={infoGroup.phone}
                mode="outlined"
                textColor="#303841"
                activeOutlineColor="#2185D5"
                label="Phone numer"
                placeholder="+49 69 1234 5678"
                onChangeText={(text) =>
                  setInfoGroup({ ...infoGroup, phone: text })
                }
                style={styles.userInput}
              />
              <View
                style={{
                  width: (width * 90) / 100,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Surface
                  elevation={5}
                  style={[styles.surface, { marginTop: 5 }]}
                >
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
              </View>

              {(infoGroup.id || infoGroup.passport) && (
                <TextInput
                  value={infoGroup.numDocument}
                  mode="outlined"
                  textColor="#303841"
                  activeOutlineColor="#2185D5"
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
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default profileUser;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",
    width,
    height,
    opacity: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2185D5",
    textAlign: "start",
  },

  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#3A4750",
    textAlign: "start",
  },
  submitBtn: {
    backgroundColor: "lightseagreen",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 3,
    marginHorizontal: 50,
  },
  editPAsswordBtn: {
    backgroundColor: "orangered",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 3,
    marginHorizontal: 50,
  },
  userInput: {
    borderRadius: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: (width * 90) / 100,
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
  },
});
