import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";
import { PaperProvider } from "react-native-paper";
import SocialView from "../components/SocialView";
import { useState } from "react";
import SignUpModal from "../components/SignUpModal";

const { height } = Dimensions.get("window");

export default function App() {
  const [isModalVisibile, setIsModalVisible] = useState(false);
  const toggleModal = (item) => {
    setIsModalVisible((item) => !item);
  };
  return (
    <View style={styles.container}>
      <PaperProvider>
        <Logo />
        <LoginForm />
        {isModalVisibile && (
          <SignUpModal
            isModalVisibile={isModalVisibile}
            toggleModal={toggleModal}
          />
        )}
        <View style={{ alignItems: "center" }}>
          <Text style={styles.primary}>
            Don't you have an account?
            <Text style={styles.link} onPress={toggleModal}>
              {" "}
              Please Sign Up.
            </Text>
          </Text>
        </View>
        <View style={{ paddingBottom: 40 }}>
          <SocialView />
        </View>
      </PaperProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "ivory",
    alignItems: "center",
    flexDirection: "column",
  },
  primary: {
    fontSize: 16,
    color: "#121481",
  },
  link: {
    fontSize: 16,
    color: "orangered",
  },
});
