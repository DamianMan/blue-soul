import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";
import { PaperProvider } from "react-native-paper";
import SocialView from "../components/SocialView";
import { useState } from "react";
import SignUpModal from "../components/SignUpModal";

export default function App() {
  const [isModalVisibile, setIsModalVisible] = useState(false);
  const toggleModal = (item) => {
    setIsModalVisible((item) => !item);
  };
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Logo />
        <LoginForm />
        {isModalVisibile && (
          <SignUpModal
            isModalVisibile={isModalVisibile}
            toggleModal={toggleModal}
          />
        )}
        <Text style={styles.primary}>
          Don't you have an account?
          <Text style={styles.link} onPress={toggleModal}>
            {" "}
            Please Sign Up.
          </Text>
        </Text>

        <SocialView />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7E6FF",
    alignItems: "center",
    flexDirection: "column",
  },
  primary: {
    fontSize: 16,
    color: "#121481",
    paddingTop: 30,
  },
  link: {
    fontSize: 16,
    color: "orangered",
  },
});
