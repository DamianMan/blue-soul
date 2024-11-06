import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Divider, TextInput } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import axios from "axios";

const { width, height } = Dimensions.get("window");

function SignUpModal({ isModalVisibile, toggleModal }) {
  const [isHide, setIsHide] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const [infoUser, setInfoUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const handleToggle = () => {
    toggleModal(isModalVisibile);
  };

  // const firebaseSign = async () => {
  //   try {
  //     await auth()
  //       .createUserWithEmailAndPassword(infoUser.email, infoUser.password)
  //       .then((credential) => {
  //         credential.user.updateProfile({
  //           displayName: infoUser.fullName,
  //         });
  //         auth().signOut();
  //       })
  //       .catch((error) => {
  //         alert(error);
  //       });
  //   } catch (err) {
  //     alert(err);
  //   }
  // };
  const signUp = async () => {
    const { fullName, email, password } = infoUser;
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/signUpUser",
          { fullName, email, password },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          if (res.data.isIn) {
            // firebaseSign();
            Alert.alert(res.data.status, res.data.message);
            toggleModal(isModalVisibile);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => Alert.alert("Error passowrd/email", err.data.message));
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = () => {
    if (
      (infoUser.email === "") | (infoUser.password === "") ||
      infoUser.fullName === ""
    ) {
      Alert.alert("Error", "Please fill all fields");
    } else if (!isValid) {
      Alert.alert("Error", "Invalid email format");
    } else {
      signUp();
    }
  };
  const validateEmail = (text) => {
    // Basic email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailPattern.test(text));
  };
  const handleEmail = (text) => {
    setInfoUser((prev) => ({ ...prev, email: text }));
    validateEmail(text);
  };
  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={isModalVisibile}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        handleToggle();
      }}
    >
      <View style={styles.centeredView}>
        <ImageBackground
          resizeMode="cover"
          style={styles.background}
          source={{
            uri: "https://img.freepik.com/free-photo/blue-user-icon-symbol-website-admin-social-login-element-concept-white-background-3d-rendering_56104-1217.jpg?ga=GA1.1.609292962.1726606020&semt=ais_hybrid",
          }}
        ></ImageBackground>
        <Pressable style={{ alignItems: "flex-end" }} onPress={handleToggle}>
          <MaterialCommunityIcons name="close-box" size={24} color="red" />
        </Pressable>
        {!loading ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.formContainer}>
              <View style={styles.centeredView}>
                <FontAwesome
                  name="user-circle-o"
                  size={24}
                  color="#48CFCB"
                  style={{ alignSelf: "center" }}
                />

                <Text style={styles.modalText}>Registration User</Text>
                <Divider />

                <View style={{ paddingVertical: 40, paddingHorizontal: 10 }}>
                  <TextInput
                    label="Full Name"
                    autoCapitalize="none"
                    value={infoUser}
                    textColor="#303841"
                    activeOutlineColor="#2185D5"
                    style={styles.userInput}
                    mode="outlined"
                    onChangeText={(text) =>
                      setInfoUser((prev) => ({ ...prev, fullName: text }))
                    }
                  />

                  <TextInput
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={infoUser}
                    textColor="#303841"
                    error={!isValid}
                    activeOutlineColor="#2185D5"
                    style={styles.userInput}
                    mode="outlined"
                    onChangeText={handleEmail}
                  />
                  <TextInput
                    label="Password"
                    autoCapitalize="none"
                    value={infoUser}
                    textColor="#303841"
                    activeOutlineColor="#2185D5"
                    style={styles.userInput}
                    mode="outlined"
                    right={
                      <TextInput.Icon
                        icon="eye"
                        onPress={() => setIsHide(!isHide)}
                      />
                    }
                    secureTextEntry={isHide}
                    onChangeText={(text) =>
                      setInfoUser((prev) => ({ ...prev, password: text }))
                    }
                  />
                </View>
                <Pressable
                  style={[styles.button, styles.buttonSubmit]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.textStyle}>Sign Up</Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator color={"#0000ff"} size={"large"} />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "aliceblue",
  },
  background: {
    width: width,
    height: height / 3,
  },
  userInput: {
    width: (width * 90) / 100,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  buttonSubmit: {
    backgroundColor: "#2196F3",
    marginHorizontal: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    color: "#303841",
  },
});

export default SignUpModal;
