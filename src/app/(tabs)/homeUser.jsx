import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";

import CustomCarousel from "../../components/CustomCarousel";

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
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        imageStyle={{ opacity: 0.5 }}
        source={{
          uri: "https://images.unsplash.com/photo-1534543210152-32025bcfaad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D",
        }}
      >
        <View style={styles.carousleContainer}>
          <CustomCarousel data={dataSports} />
        </View>
        <View style={styles.carousleContainer}>
          <CustomCarousel data={dataActivities} />
        </View>
        <View style={styles.carousleContainer}>
          <CustomCarousel data={dataStudies} />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  carousleContainer: { marginVertical: 30 },
});

export default MyCarousel;
