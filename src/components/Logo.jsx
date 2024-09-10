import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

function Logo(props) {
  return (
    <ImageBackground
      source={require("../../assets/bluesoul-logo.png")}
      style={[styles.background, width]}
    >
      <View style={styles.container}>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/bluesoul-logo.png")}
          resizeMode="contain"
        />
      </View>
    </ImageBackground>
  );
}

export default Logo;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    width: width,
  },
  background: {
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
  },

  tinyLogo: {
    width: (width * 77) / 100,
    height: (height * 45) / 100,
  },
});
