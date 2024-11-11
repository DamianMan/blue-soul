import { BlurView } from "expo-blur";
import { Alert, Platform } from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { TextInput, Divider, Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import * as Notifications from "expo-notifications";

import auth from "@react-native-firebase/auth";
import { ContextData } from "../context/ContextDataProvider";

const { width, height } = Dimensions.get("window");

function pushNotifications(props) {
  const { isNotification, getNotificationStatus } = useContext(ContextData);
  const [title, setTitle] = useState("");
  const [groupToken, setGroupToken] = useState("");
  const [message, setMessage] = useState("");

  async function schedulePushNotification(title, message) {
    await Notifications.scheduleNotificationAsync({
      content: {
        sound: "default",
        title: title,
        body: message,
        data: { data: "goes here", test: { test1: "more data" } },
      },
      trigger: { seconds: 5 },
    })
      .then((res) => console.log("Success:", res))
      .catch((err) => console.log("Error:", err));
  }

  const handleSubmit = async () => {
    // schedulePushNotification(title, message);
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/sendNotifications",
          { title, groupToken, message, isNotification },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);

          console.log("Notif Status:", res.data.notification);

          setMessage("");
          setTitle("");
          setGroupToken("");
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      Alert.alert("Error Making Request", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.57,
          shadowRadius: 4.65,

          elevation: 6,
        }}
      >
        <Image
          style={styles.imageBg}
          resizeMode="cover"
          source={{
            uri: `https://images.unsplash.com/photo-1725798451557-fc60db3eb6a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5vdGlmaWNhdGlvbiUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D`,
          }}
        />
      </View>
      <View style={{ marginVertical: 30 }}>
        <Text style={styles.title}>
          Please Write Below The{" "}
          <Text style={{ color: "#2185D5", fontSize: 22 }}>Notification</Text>{" "}
          You Want Sending To A Group
        </Text>
        <MaterialCommunityIcons
          name="cellphone-message"
          size={62}
          color="#2185D5"
          style={{
            alignSelf: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.55,
            shadowRadius: 2.84,

            elevation: 5,
          }}
        />
        {/* <Text>Your expo push token: {expoPushToken}</Text> */}
      </View>
      <Divider style={styles.divider} />
      <View style={styles.secondConteiner}>
        <TextInput
          mode="outlined"
          value={title}
          textColor="#ff5f00"
          activeOutlineColor={"#121481"}
          onChangeText={(text) => setTitle(text)}
          label={"Title Msg"}
          style={styles.userInput}
        />
        <TextInput
          mode="outlined"
          value={groupToken}
          textColor="#ff5f00"
          autoCapitalize="none"
          activeOutlineColor={"#121481"}
          onChangeText={(text) => setGroupToken(text)}
          label={"Group Token"}
          multiline={true}
          style={styles.userInput}
        />
        <TextInput
          mode="outlined"
          value={message}
          textColor="#ff5f00"
          activeOutlineColor={"#121481"}
          onChangeText={(text) => setMessage(text)}
          label={"Message"}
          multiline={true}
          style={styles.userInput}
        />
        <Button
          mode="elevated"
          labelStyle={{
            color: "#000",
            fontSize: 15,
          }}
          elevation={6}
          icon="send"
          style={styles.submitBtn}
          onPress={handleSubmit}
        >
          Send
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F3F3",
  },
  imageBg: {
    height: height / 2.5,
    borderEndStartRadius: 30,
    borderEndEndRadius: 30,
  },
  userInput: {
    width: (width * 80) / 100,
    borderRadius: 10,
  },
  shadowImage: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,

    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 3,
    },
    shadowOpacity: 0.67,
    shadowRadius: 2.65,

    elevation: 6,
    opacity: 0.7,
  },
  secondConteiner: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 30,
    padding: 20,
    borderRadius: 20,
    shadowColor: "mediumaquamarine",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.67,
    shadowRadius: 4.65,

    elevation: 6,
    opacity: 0.7,
  },
  blurView: {
    overflow: "hidden",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 50,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    color: "#303841",
    fontSize: 18,
    fontWeight: "consentBold",
    textAlign: "center",
    padding: 20,
  },
  divider: {
    backgroundColor: "mediumaquamarine",
    height: 1,
    marginBottom: 40,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  submitBtn: {
    marginTop: 30,
    backgroundColor: "limegreen",
  },
});

export default pushNotifications;
