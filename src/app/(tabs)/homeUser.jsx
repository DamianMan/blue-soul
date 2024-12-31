import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import auth from "@react-native-firebase/auth";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  FadeIn,
  FadeOut,
  Extrapolation,
} from "react-native-reanimated";
import InfoUserCardItem from "../../components/InfoUserCardItem";
import { useContext, useEffect, useState, useRef } from "react";
import { ContextData } from "../../context/ContextDataProvider";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import FoodDrinkNotifModal from "../../components/FoodDrinkNotifModal";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const { width, height } = Dimensions.get("window");

const HeightIMG = height / 2;

export default function MyCarousel() {
  const { services, users, getUsers, loading, getGroups } =
    useContext(ContextData);
  const user = auth().currentUser;
  const scrollRef = useAnimatedRef();
  const [isNotification, setIsNotification] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined > undefined);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { getNotificationStatus } = useContext(ContextData);
  useEffect(() => {
    const loadUsers = async () => {
      await getUsers();
      await getGroups();
    };
    loadUsers();
  }, [notification]);

  useEffect(() => {
    if (user) {
      userFound = users.find((item) => item.email === user?.email);
      if (userFound) {
        setIsNotification(userFound.isNotification);

        console.log("Current User Notif status:", userFound.isNotification);
      }
      // setIsNotification(userFound.isNotification);
    }
  }, [users]);
  // Notification

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      token && setExpoPushToken(token);
    });

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
        setNotification(true);

        // Active Status when notification is open and the function set the value to true.
        // getNotificationStatus(
        //   response.notification.request.content.data.notification
        // );
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

  // Save Push Token In Db
  const submitPushToken = async (token) => {
    const userEmail = user?.email;
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/postToken",
          { token, userEmail },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      console.log("Error Request Sendind Notification Home User", error);
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
        data: { notification: true, test: { test1: "more data" } },
      },
      trigger: { seconds: 10 },
    })
      .then((res) => console.log("Success:", res))
      .catch((err) => console.log("Error:", err));
  }

  const scrollOffset = useScrollViewOffset(scrollRef);
  const fadeOut = () => {
    fadeInOpacity.value = withTiming(0, {
      duration: 1000,
      easing: Easing.linear,
    });
  };
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
      opacity: interpolate(
        scrollOffset.value,
        [0, HeightIMG / 2, HeightIMG], // Adjust this range to control the fade-out speed
        [0.9, 0.5, 0], // Starts fully opaque, fades out halfway, and becomes invisible
        Extrapolation.CLAMP
      ),
    };
  });

  if (loading) {
    return (
      <Animated.ScrollView
        contentContainerStyle={[styles.container, { justifyContent: "center" }]}
        ref={scrollRef}
        scrollEventThrottle={16}
        entering={FadeIn}
      >
        <ActivityIndicator size={"large"} color={"#2185D5"} />
      </Animated.ScrollView>
    );
  }

  return (
    <Animated.ScrollView
      style={styles.container}
      ref={scrollRef}
      scrollEventThrottle={16}
      entering={FadeIn}
    >
      <Animated.Image
        style={[styles.image, imageAnimatedStyle]}
        resizeMode="cover"
        source={{
          uri: "https://images.unsplash.com/photo-1725272123537-105e02c214d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
        }}
      />
      <View style={{ backgroundColor: "#F3F3F3", flex: 1 }}>
        <View>
          <Text style={styles.introText}>
            Hello <Text style={styles.textName}>{user?.displayName}</Text>,
            Welcome To <Text style={styles.textName}>Blue Soul</Text> App
          </Text>
        </View>
        <View style={styles.viewBackground}>
          <Text style={styles.introTextSub}>
            Here you can find all you need
          </Text>
          <Text style={styles.introTextSub}>
            From sport 🏄🏼‍♂️, activities 🚴🏻 to food 🍝 and drinks 🥤
          </Text>
          <Text style={styles.introTextSub}>
            Everything you will have during your days here with us! Have Fun 🤩!
          </Text>
          <Text style={styles.introTextSub}>
            Have Fun By <Text style={{ color: "#2185D5" }}>BLUE SOUL</Text> 🤩!
          </Text>
        </View>

        <FlatList
          horizontal
          data={services}
          renderItem={({ item }) => (
            <InfoUserCardItem
              key={item.name}
              src={item.images[0]}
              title={item.name}
              nameActivity={item.url}
              text={item.subTitle}
              description={item.description}
            />
          )}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false} // Disable scrolling
        />
        {/* {services.map((item) => (
          <InfoUserCardItem
            key={item.name}
            src={item.images[0]}
            title={item.name}
            nameActivity={item.url}
            text={item.subTitle}
            description={item.description}
          />
        ))} */}
        {isNotification && (
          <FoodDrinkNotifModal
            status={isNotification}
            text={isNotification ? "Notif True" : "Notif False"}
          />
        )}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  carousleContainer: { marginVertical: 30 },
  introText: {
    color: "#303841",
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
    shadowColor: "#2185D5",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },
  textName: {
    color: "#2185D5",
  },
  image: {
    width,
    height: HeightIMG,
    opacity: 0.8,
  },
  introTextSub: {
    color: "#3A4750",
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
