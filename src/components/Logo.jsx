import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
const { width, height } = Dimensions.get("window");

function Logo(props) {
  return (
    <>
      <ImageBackground
        resizeMode="cover"
        source={require("../../assets/bluesoul-logo.png")}
        style={[styles.background, width]}
      />
      <View style={styles.container}>
        <ImageBackground
          style={styles.tinyLogo}
          source={require("../../assets/bluesoul-logo.png")}
          resizeMode="cover"
        />
      </View>
    </>
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
    marginVertical: 40,
  },
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    height: height / 2,

    opacity: 0.7,
  },

  tinyLogo: {
    overflow: "hidden",
    width: (width * 85) / 100,
    height: (height * 35) / 100,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
