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
import { PaperProvider, Divider } from "react-native-paper";
import SocialView from "../components/SocialView";
import { useContext, useState } from "react";
import SignUpModal from "../components/SignUpModal";
import { ContextData } from "../context/ContextDataProvider";
import HomeLoader from "../components/HomeLoader";

const { height, width } = Dimensions.get("window");

export default function login() {
  const { loading } = useContext(ContextData);
  const [isModalVisibile, setIsModalVisible] = useState(false);
  const toggleModal = (item) => {
    setIsModalVisible((item) => !item);
  };

  return (
    <View style={styles.container}>
      <PaperProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : height}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo />

            <LoginForm />
            <View>
              <Text style={styles.primary}>
                Don't you have an account?
                <Text style={styles.link} onPress={toggleModal}>
                  {" "}
                  Register.
                </Text>
              </Text>
              <Divider
                style={{
                  backgroundColor: "#0099FF",
                  width: (width * 90) / 100,
                  marginBottom: Platform.OS === "ios" && 20,
                }}
              />

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SocialView />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {isModalVisibile && (
          <SignUpModal
            isModalVisibile={isModalVisibile}
            toggleModal={toggleModal}
          />
        )}
      </PaperProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    flexDirection: "column",
  },
  primary: {
    fontSize: 16,
    color: "#303841",
    textAlign: "center",
    paddingVertical: 30,
  },
  link: {
    fontSize: 16,
    color: "#0099FF",
  },
});
