import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  SectionList,
} from "react-native";
import auth from "@react-native-firebase/auth";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import InfoUserCardItem from "../../components/InfoUserCardItem";
import { useContext } from "react";
import { ContextData } from "../../context/ContextDataProvider";

const { width } = Dimensions.get("window");

const HeightIMG = 300;
const dataInfoUser = [
  {
    title: "Sports",
    url: "sports",
    image:
      "https://images.unsplash.com/photo-1581545048011-564bf4a743ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhdGVyJTIwc3BvcnRzfGVufDB8fDB8fHww",
  },
  {
    title: "Activities",
    url: "activities",
    image:
      "https://images.unsplash.com/photo-1644633539216-f0042ac2d839?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFjdGl2aXRpZXN8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Food & Drink",
    url: "foodDrink",
    image:
      "https://plus.unsplash.com/premium_photo-1677000666761-ff476a65c8ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",
  },
];

const dataSports = [
  {
    title: "Sport 1",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
  {
    title: "Sport 2",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
  {
    title: "Sport 3",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
];

const dataActivities = [
  {
    title: "Activities 1",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
  {
    title: "Activities 2",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
  {
    title: "Activities 3",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
];

const dataStudies = [
  {
    title: "Studies 1",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
  {
    title: "Studies 2",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
  {
    title: "Studies 3",
    image:
      "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
  },
];

export default function MyCarousel() {
  const { services } = useContext(ContextData);
  const user = auth().currentUser;
  const scrollRef = useAnimatedRef();

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
