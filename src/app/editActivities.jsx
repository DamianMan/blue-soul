import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { ContextData } from "../context/ContextDataProvider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button, Divider, FAB, TextInput } from "react-native-paper";
import FabActivitiesItem from "../components/FabActivitiesItem";
import UploadImageItem from "../components/UploadImageItem";
import axios from "axios";

const { height, width } = Dimensions.get("window");
function editActivities(props) {
  const { services, getServices } = useContext(ContextData);
  const [display, setDisplay] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");

  useEffect(() => {
    getServices();
  }, []);

  const handlePressFAB = (id) => {
    const currentActivity = services.find((item) => item.url === id);
    if (currentActivity) {
      setDisplay(true);
      setName(currentActivity.name);
      setSubtitle(currentActivity.subTitle);
      setDescription(currentActivity.description);
      setImages(currentActivity.images);
      setId(currentActivity._id);
      setPressed(true);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios
        .post(
          "http://localhost:3000/api/editService",
          { id, name, subtitle, description, images },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => Alert.alert(res.data.status, res.data.message))
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      Alert.alert("Error", error);
    }
  };

  const uploadImage = (image) => {
    setImages((prev) => [...prev, image]);
  };

  // Delete Image
  const handleDeleteImage = async (idService, imageUrl) => {
    try {
      await axios
        .post(
          "http://localhost:3000/api/deleteImage",
          { idService, imageUrl },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => Alert.alert(res.data.status, res.data.message))
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      console.log("Error Request:", error);
    }
  };

  // Item Image Component
  const ItemImage = ({ url, id }) => {
    return (
      <ImageBackground source={{ uri: url }} style={styles.imageItem}>
        <Pressable
          style={{ alignItems: "flex-end" }}
          onPress={() => handleDeleteImage(id, url)}
        >
          <MaterialCommunityIcons name="delete-forever" size={30} color="red" />
        </Pressable>
      </ImageBackground>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={styles.image}
        imageStyle={styles.image}
        resizeMode="cover"
        source={{
          uri: "https://images.unsplash.com/photo-1677688013109-61dda1cfc53f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
        }}
      />
      <View>
        <Text
          style={[
            styles.titleText,
            { letterSpacing: 0, padding: 10, marginTop: 20, fontSize: 18 },
          ]}
        >
          Tap On The <Text style={styles.activity}>Activity</Text> You Want To
          Edit
        </Text>
        <MaterialCommunityIcons
          name="gesture-tap"
          size={50}
          color="#3FA2F6"
          style={{ alignSelf: "center" }}
        />
      </View>
      <View
        style={{
          margin: 20,
        }}
      >
        {services.map((item) => (
          <FabActivitiesItem
            key={item.url}
            name={item.name}
            url={item.url}
            hanldePress={handlePressFAB}
          />
        ))}
        <Divider style={styles.divider} />
      </View>
      {display && (
        <View style={styles.activityView}>
          <Text style={styles.activityTitle}>{name}</Text>
          <TextInput
            value={name}
            label={"Name"}
            textColor="#ff5f00"
            activeOutlineColor="#121481"
            autoCapitalize="none"
            onChangeText={(text) => setName(text)}
            mode="outlined"
            style={styles.userInput}
          />
          <TextInput
            value={subtitle}
            label={"Subtitle"}
            textColor="#ff5f00"
            activeOutlineColor="#121481"
            autoCapitalize="none"
            onChangeText={(text) => setSubtitle(text)}
            mode="outlined"
            multiline={true}
            style={styles.userInput}
          />
          <TextInput
            value={description}
            label={"Description"}
            textColor="#ff5f00"
            activeOutlineColor="#121481"
            autoCapitalize="none"
            onChangeText={(text) => setDescription(text)}
            mode="outlined"
            multiline={true}
            style={styles.userInput}
          />
          <View
            style={{
              marginLeft: 10,
              paddingVertical: 20,
              paddingHorizontal: 10,
            }}
          >
            <FlatList
              horizontal
              data={images}
              renderItem={({ item }) => <ItemImage url={item} id={id} />}
              keyExtractor={(item) => item}
            />
          </View>

          <UploadImageItem uploadImage={uploadImage} />
          <Button
            mode="elevated"
            labelStyle={{ color: "#ffff", fontSize: 15 }}
            icon={"database"}
            style={styles.submitBtn}
            onPress={handleSubmit}
          >
            Submit {name}
          </Button>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    height: height / 3,
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 2.84,

    elevation: 5,
    opacity: 0.8,
  },

  activity: {
    fontSize: 20,
    color: "orangered",
  },
  submitBtn: {
    backgroundColor: "#3572EF",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  activityTitle: {
    fontSize: 22,
    color: "#3FA2F6",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  divider: {
    marginTop: 30,
    height: 1,
    borderRadius: 10,
    backgroundColor: "gainsboro",
  },
  activityView: {
    paddingVertical: 20,
  },
  titleText: {
    textAlign: "center",
    fontSize: 20,
    color: "midnightblue",
    letterSpacing: 1,
  },
  userInput: {
    width: (width * 90) / 100,
    borderRadius: 30,
    backgroundColor: "#fff",
    shadowColor: "#3572EF",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2.65,

    elevation: 8,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  imageItem: {
    width: 200,
    height: 200,
    marginHorizontal: 5,
    borderRadius: 5,
  },
});

export default editActivities;
