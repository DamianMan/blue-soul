import { useState } from "react";
import { ImageBackground, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function UploadImageItem({ uploadImage }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
      console.log(result);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        style={styles.uploadBtn}
        icon={"camera"}
        onPress={pickImage}
        mode="elevated"
        labelStyle={styles.uploadBtn}
      >
        Upload Image
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  uploadBtn: {
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "sandybrown",
  },
});
