import { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
const { width } = Dimensions.get("window");
import auth from "@react-native-firebase/auth";

export default function LoginForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHide, setIsHide] = useState(true);
  const [isValid, setIsValid] = useState(true);

  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error);
    }
  };

  const validateEmail = (text) => {
    // Basic email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailPattern.test(text));
  };
  const handleEmail = (text) => {
    setEmail(text);
    validateEmail(text);
  };

  const handlePassword = (text) => {
    setPassword(text);
  };

  const handleSubmit = () => {
    if ((email === "") | (password === "")) {
      Alert.alert("Error", "Please fill all fields");
    } else if (!isValid) {
      Alert.alert("Error", "Invalid email format");
    } else {
      signIn();
      setEmail("");
      setPassword("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View>
        <Button
          mode="contained"
          icon={({ size, color }) => (
            <Icon
              name={email === "admin@mail.com" ? "lock" : "account"}
              size={30}
              color="#ff5f00"
            /> // Custom icon color
          )}
          labelStyle={{ color: "#FF9F66", fontSize: 20 }}
          style={styles.iconLogin}
        >
          {email === "admin@mail.com" ? "ADMIN" : "USER"}
        </Button>
      </View>
      <View style={styles.centered}>
        <TextInput
          label={email === "admin@mail.com" ? "Admin" : "Email"}
          value={email}
          mode="outlined"
          keyboardType="email-address"
          textColor="#ff5f00"
          error={!isValid}
          autoCapitalize="none"
          activeOutlineColor={"#121481"}
          onChangeText={handleEmail}
          style={styles.userInput}
        />
        <TextInput
          label="Password"
          value={password}
          secureTextEntry={isHide}
          right={
            <TextInput.Icon icon="eye" onPress={() => setIsHide(!isHide)} />
          }
          mode="outlined"
          textColor="#ff5f00"
          activeOutlineColor="#121481"
          autoCapitalize="none"
          onChangeText={handlePassword}
          style={styles.userInput}
        />
      </View>
      <View style={{ paddingTop: 20 }}>
        <Button
          mode="elevated"
          labelStyle={{ color: "#ffff", fontSize: 15 }}
          icon={({ size, color }) => (
            <Icon name="login" size={30} color="#fff" /> // Custom icon color
          )}
          onPress={handleSubmit}
          style={styles.submitBtn}
        >
          {email === "admin@mail.com" ? "Get Admin Panel" : "Login"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorInput: {
    borderColor: "red",
  },

  welcome: {
    paddingTop: 10,
    alignSelf: "center",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  lefted: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  textPrimary: {
    color: "#121481",
    fontWeight: "bold",
    textAlign: "start",
    fontSize: 30,
    paddingHorizontal: 5,
  },
  textSecondary: {
    color: "#0B2F9F",
    textAlign: "start",
    fontSize: 15,
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  iconLogin: {
    fontSize: 20,
    backgroundColor: "transparent",
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
  },

  customLine: {
    backgroundColor: "#00e0ff",
    marginTop: 20,
  },
  userInput: {
    width: (width * 90) / 100,
    borderRadius: 10,
  },
  submitBtn: {
    backgroundColor: "#050C9C",
    borderRadius: 3,
  },
});
