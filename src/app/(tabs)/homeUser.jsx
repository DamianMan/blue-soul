import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import auth from "@react-native-firebase/auth";
import CustomCarousel from "../../components/CustomCarousel";
import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { shadow } from "react-native-paper";
const { width } = Dimensions.get("window");

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

const MyCarousel = () => {
  const user = auth().currentUser;
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={styles.image}
        resizeMode="cover"
        source={{
          uri: "https://images.unsplash.com/photo-1725272123537-105e02c214d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
        }}
      >
        <View>
          <Text style={styles.introText}>
            Hello <Text style={styles.textName}>{user?.displayName}</Text>,
            Welcome To Blue Soul App
          </Text>
        </View>
      </ImageBackground>
      <View>
        <Text style={styles.introTextSub}>
          Here you can find everything: from sport, activities to food and
          drinks to pick during your days here with us! Have Fun!
        </Text>
      </View>

      <View style={styles.carousleContainer}>
        <CustomCarousel data={dataActivities} />
      </View>
      <View style={styles.carousleContainer}>
        <CustomCarousel data={dataStudies} />
      </View>
    </ScrollView>
  );
};

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
  textName: {
    color: "orangered",
  },
  image: {
    width,
    height: 300,
    opacity: 0.8,
  },
  introTextSub: {
    color: "#0B2F9F",
    fontSize: 16,
    letterSpacing: 2,
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

export default MyCarousel;
