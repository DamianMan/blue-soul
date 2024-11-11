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
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width,
        height: height / 2,
      }}
    >
      <ImageBackground
        resizeMode="cover"
        source={{
          uri: "https://images.unsplash.com/photo-1551506448-074afa034c05?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
        }}
        style={[styles.background, width]}
      />
      <View style={styles.container}>
        <ImageBackground
          style={styles.tinyLogo}
          source={{
            uri: "https://images.unsplash.com/photo-1551506448-074afa034c05?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
          }}
          resizeMode="cover"
        >
          <ImageBackground
            style={{
              width: width / 2,
              height: height / 2,
            }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        </ImageBackground>
      </View>
    </View>
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

    opacity: 0.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.65,
    shadowRadius: 3.84,
  },

  tinyLogo: {
    overflow: "hidden",
    width: (width * 85) / 100,
    height: (height * 35) / 100,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.95,
    shadowRadius: 0.84,

    elevation: 20,
  },
});
