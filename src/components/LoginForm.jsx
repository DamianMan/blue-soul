import { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
const { width } = Dimensions.get("window");
import auth from "@react-native-firebase/auth";
import Loader from "./Loader";

export default function LoginForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHide, setIsHide] = useState(true);
  const [isValid, setIsValid] = useState(true);

  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);

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
  if (loading) {
    return <Loader />;
  }

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 30,
        flexGrow: 1,
      }}
    >
      <Button
        mode="contained"
        icon={({ size, color }) => (
          <Icon
            name={
              email === "admin@mail.com" || email === "staff@mail.com"
                ? "lock"
                : "account"
            }
            size={30}
            color="#0099FF"
          /> // Custom icon color
        )}
        labelStyle={{ color: "#0099FF", fontSize: 20 }}
        style={styles.iconLogin}
      >
        {email === "admin@mail.com" || email === "staff@mail.com"
          ? "ADMIN"
          : "USER"}
      </Button>
      <TextInput
        label={
          email === "admin@mail.com" || email === "staff@mail.com"
            ? "Admin"
            : "Email"
        }
        value={email}
        mode="outlined"
        keyboardType="email-address"
        textColor="#303841"
        error={!isValid}
        autoCapitalize="none"
        activeOutlineColor={"#2185D5"}
        onChangeText={handleEmail}
        style={styles.userInput}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry={isHide}
        right={<TextInput.Icon icon="eye" onPress={() => setIsHide(!isHide)} />}
        mode="outlined"
        textColor="#303841"
        activeOutlineColor="#2185D5"
        autoCapitalize="none"
        onChangeText={handlePassword}
        style={styles.userInput}
      />
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
          {email === "admin@mail.com" || email === "staff@mail.com"
            ? "Get Admin Panel"
            : "Login"}
        </Button>
      </View>
    </View>
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
    backgroundColor: "#fff",
  },
  submitBtn: {
    backgroundColor: "#0099FF",
    borderRadius: 3,
  },
});
