import { BlurView } from "expo-blur";
import { Platform } from "react-native";
import React, { useState, useRef, useEffect } from "react";
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
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const { width, height } = Dimensions.get("window");

function pushNotifications(props) {
  const [title, setTitle] = useState("");
  const [groupToken, setGroupToken] = useState("");
  const [message, setMessage] = useState("");

  // Notification

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined > undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        sound: "default",
        title: "You've got mail! 📬",
        body: "Here is the notification body",
        data: { data: "goes here", test: { test1: "more data" } },
      },
      trigger: { seconds: 10 },
    })
      .then((res) => console.log("Success:", res))
      .catch((err) => console.log("Error:", err));
  }

  const handleSubmit = async () => {
    // try {
    //   await axios
    //     .post(
    //       "http://localhost:3000/api/sendNotifications",
    //       { title, groupToken, message },
    //       { headers: { "Content-Type": "application/json" } }
    //     )
    //     .then((res) => console.log(res.data))
    //     .catch((err) => console.log(err.data));
    // } catch (error) {}
    const body = {
      to: "ExponentPushToken[veqgrlE44VfLmEfRI2jzIo]", // The device push token
      sound: "default",
      title: title,
      body: message,
      data: { someData: "data content" }, // Custom data
    };

    try {
      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        body,
        {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Notification sent!", response.data);
    } catch (error) {
      console.error(
        "Error sending notification:",
        error.response ? error.response.data : error.message
      );
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
          <Text style={{ color: "orangered", fontSize: 22 }}>Message</Text> You
          Want Sending To A Group
        </Text>
        <MaterialCommunityIcons
          name="cellphone-message"
          size={62}
          color="orangered"
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
        <Text>Your expo push token: {expoPushToken}</Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.secondConteiner}>
        <TextInput
          mode="outlined"
          value={title}
          textColor="#ff5f00"
          autoCapitalize="none"
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
          style={styles.userInput}
        />
        <TextInput
          mode="outlined"
          value={message}
          textColor="#ff5f00"
          autoCapitalize="none"
          activeOutlineColor={"#121481"}
          onChangeText={(text) => setMessage(text)}
          label={"Message"}
          multiline={true}
          style={styles.userInput}
        />
        <Button
          mode="elevated"
          labelStyle={{
            color: "midnightblue",
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
    backgroundColor: "lightcyan",
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
    color: "darkblue",
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
