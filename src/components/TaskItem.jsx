import React from "react";
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

const { width } = Dimensions.get("window");

function TaskItem({ text, img, icon, url }) {
  return (
    <Link href={`/${url}`} asChild>
      <Pressable style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          source={{ uri: img }}
          resizeMode="cover"
        >
          <BlurView
            intensity={8}
            style={styles.blurContainer}
            experimentalBlurMethod={true}
          >
            <Text style={styles.text}>{text}</Text>
          </BlurView>
        </ImageBackground>
        <FontAwesome
          name={icon}
          size={35}
          color={
            (icon === "plus-square" && "#1B9C85") ||
            (icon === "edit" && "#FF9209") ||
            (icon === "list-alt" && "orangered")
          }
          style={{
            paddingHorizontal: 15,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 1,

            elevation: 8,
          }}
        />
      </Pressable>
    </Link>
  );
}

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 3,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    height: 100,
  },
  imageBackground: {
    width: (width * 80) / 100, // Ensure it takes the full width of the parent Pressable
    height: 100, // Set a specific height
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    opacity: 0.8,
    borderRadius: 10,
  },
  text: {
    color: "#E85C0D",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowColor: "#000",
    textShadowOffset: {
      width: 0,
      height: 3,
    },
    textShadowOpacity: 0.6,
    textShadowRadius: 0.8,
    fontSize: 33,

    borderRadius: 10,
  },
  blurContainer: {
    padding: 5,
    borderRadius: 20,
    width: (width * 80) / 100,
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
  },
});
