import { router } from "expo-router";
import React, { useRef, useEffect } from "react";
import { Pressable } from "react-native";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
  Image,
} from "react-native";
import { Icon } from "react-native-paper";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

function HomeLoader({ loading }) {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);
  const handlePress = () => {
    router.navigate("login");
  };
  return (
    <ImageBackground
      style={styles.image}
      resizeMode="cover"
      source={require("../../assets/homeLoader.png")}
    >
      <View style={styles.centered}>
        {/* {loading && <ActivityIndicator size={"large"} color={"lightgrey"} />} */}
        {loading && (
          <LottieView
            ref={animationRef}
            source={require("../../assets/animations/turtle.json")}
            loop
            autoplay
            style={{ width: 250, height: 350 }}
          />
        )}
      </View>
      <Pressable
        onPress={handlePress}
        style={[
          styles.imageContainter,
          {
            opacity: loading ? 0.8 : 1,
            shadowOpacity: loading ? 0.25 : 4.25,
            shadowRadius: loading ? 4.25 : 9.84,
          },
        ]}
        disabled={loading}
      >
        <Image
          source={require("../../assets/logo.png")}
          resizeMode="cover"
          style={styles.imageLogo}
        />
        <Icon source="arrow-right" color={"dodgerblue"} size={30} />
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: { height, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
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
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 60,
    marginHorizontal: 60,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 4.25,
    shadowRadius: 9.84,

    elevation: 5,
  },
});

export default HomeLoader;
