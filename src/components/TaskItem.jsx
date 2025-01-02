import React, { useContext } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { BlurView } from "expo-blur";
import { ContextData } from "../context/ContextDataProvider";
import auth from "@react-native-firebase/auth";

const { width, height } = Dimensions.get("window");

function TaskItem({ text, img, icon, url, isAdmin }) {
  return (
    <Link href={`/${url}`} asChild>
      <Pressable style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          source={{ uri: img }}
          resizeMode="cover"
          imageStyle={{ borderRadius: 10 }}
        >
          <BlurView
            intensity={16}
            style={[
              styles.blurContainer,
              { width: !isAdmin ? (width * 90) / 100 : (width * 70) / 100 },
            ]}
            experimentalBlurMethod={true}
          >
            <Text style={styles.text}>{isAdmin ? text : "Check Groups"}</Text>
            <FontAwesome
              name={icon}
              size={45}
              color={
                (icon === "plus-square" && "#1B9C85") ||
                (icon === "edit" && "#FF9209") ||
                (icon === "list-alt" && "orangered")
              }
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 1,
                marginHorizontal: 3,

                elevation: 8,
                paddingHorizontal: 10,
              }}
            />
          </BlurView>
        </ImageBackground>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "central",
    alignItems: "central",
    flexDirection: "row",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginHorizontal: 10,
    elevation: 3,
    borderRadius: 10,
    marginVertical: 50,
    height: height / 3, // Set a specific height
  },
  imageBackground: {
    height: height / 3, // Set a specific height
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    flexDirection: "row",
    opacity: 0.8,
    borderRadius: 10,
  },
  text: {
    color: "#0077C0",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowColor: "#000",
    textShadowOffset: {
      width: 0,
      height: 3,
    },
    marginHorizontal: 5,

    textShadowOpacity: 0.6,
    textShadowRadius: 0.8,
    fontSize: 33,
    borderRadius: 10,
  },
  blurContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
  },
});
export default TaskItem;
