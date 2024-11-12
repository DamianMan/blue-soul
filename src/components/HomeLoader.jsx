import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
  Image,
} from "react-native";

const { width, height } = Dimensions.get("window");

function HomeLoader(props) {
  return (
    <ImageBackground
      style={styles.image}
      resizeMode="cover"
      source={{
        uri: "https://images.unsplash.com/photo-1509641498745-13c26fd1ed89?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
    >
      <View style={styles.centered}>
        <ActivityIndicator size={"large"} color={"lightgrey"} />
      </View>
      <View style={styles.imageContainter}>
        <Image
          source={require("../../assets/logo.png")}
          resizeMode="cover"
          style={styles.imageLogo}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: { height, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#303841",
    fontSize: 16,
  },
  imageLogo: { width: 200, height: 200 },
  imageContainter: {
    backgroundColor: "aliceblue",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 60,
    marginHorizontal: 60,
    shadowColor: "lightblue",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default HomeLoader;
