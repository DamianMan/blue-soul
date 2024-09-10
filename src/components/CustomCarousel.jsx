import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const CustomCarousel = ({ data }) => {
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        style={styles.carousel}
        width={width}
        height={width / 2}
        data={data}
        autoplay={true}
        scrollAnimationDuration={1000}
        mode="parallax"
        withAnimation={{ type: "spring", config: 10000 }}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{
              justifyContent: "center",
              borderRadius: 30,
            }}
          >
            <ImageBackground
              resizeMode="stretch"
              style={{
                paddingVertical: 80,
                justifyContent: "center",
                alignItems: "center",
              }}
              imageStyle={{ borderRadius: 30 }}
              source={{
                uri: item.image,
              }}
            >
              <BlurView intensity={100} style={styles.blurContainer}>
                <Text style={styles.textCarousel}>{item.title}</Text>
              </BlurView>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    marginVertical: 30,
  },

  blurContainer: {
    padding: 30,
    margin: 16,
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
    width: (width * 95) / 100,
  },
  textCarousel: {
    textAlign: "center",
    fontSize: 30,
    position: "absolute",
    alignSelf: "center",
  },
});

export default CustomCarousel;
