import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import auth from "@react-native-firebase/auth";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import InfoUserCardItem from "../../components/InfoUserCardItem";
import { useContext, useEffect, useState, useRef } from "react";
import { ContextData } from "../../context/ContextDataProvider";

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

const { width } = Dimensions.get("window");

const HeightIMG = 300;

export default function MyCarousel() {
  const { services } = useContext(ContextData);
  const user = auth().currentUser;
  const scrollRef = useAnimatedRef();

  // Notification

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined > undefined);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { getNotificationStatus } = useContext(ContextData);

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
        console.log(response.notification.request.content.data);
        getNotificationStatus(
          response.notification.request.content.data.notification
        );
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

  const submitPushToken = async (token) => {
    const userEmail = user?.email;
    try {
      await axios

        .post(
          "http://192.168.1.56:3000/api/postToken",
          { token, userEmail },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => Alert.alert(res.data.status, res.data.message))
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      Alert.alert("Error Request", error);
    }
  };

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
        submitPushToken(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
      alert("Push Token Not Stored");
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

  const scrollOffset = useScrollViewOffset(scrollRef);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HeightIMG, 0, HeightIMG],
            [-HeightIMG / 2, 0, HeightIMG * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HeightIMG, 0, HeightIMG],
            [2, 1, 1]
          ),
        },
      ],
    };
  });
  return (
    <Animated.ScrollView
      style={styles.container}
      ref={scrollRef}
      scrollEventThrottle={16}
    >
      <Animated.Image
        style={[styles.image, imageAnimatedStyle]}
        resizeMode="cover"
        source={{
          uri: "https://images.unsplash.com/photo-1725272123537-105e02c214d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
        }}
      />
      <View style={{ backgroundColor: "ivory", flex: 1 }}>
        <View>
          <Text style={styles.introText}>
            Hello <Text style={styles.textName}>{user?.displayName}</Text>,
            Welcome To <Text style={styles.textName}>Blue Soul</Text> App
          </Text>
        </View>
        <View style={styles.viewBackground}>
          <Text style={styles.introTextSub}>
            Here you can find everything: from sport 🏄🏼‍♂️, activities 🚴🏻 to food
            🍝 and drinks 🥤 you will have during your days here with us! Have
            Fun 🤩!
          </Text>
        </View>
        {services.map((item) => (
          <InfoUserCardItem
            key={item.name}
            src={item.images[0]}
            title={item.name}
            nameActivity={item.url}
            text={item.subTitle}
            description={item.description}
          />
        ))}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  carousleContainer: { marginVertical: 30 },
  introText: {
    color: "darkblue",
    paddingHorizontal: 20,
    paddingVertical: 20,
    fontSize: 30,
    letterSpacing: 1,
  },
  viewBackground: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 20,
    marginVertical: 20,
    shadowColor: "orangered",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },
  textName: {
    color: "orangered",
  },
  image: {
    width,
    height: HeightIMG,
    opacity: 0.8,
  },
  introTextSub: {
    color: "steelblue",
    fontSize: 16,
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  userText: {
    fontSize: 20,
    color: "darkblue",
    letterSpacing: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  shadow: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    opacity: 0.7,
    elevation: 6,
  },
});
