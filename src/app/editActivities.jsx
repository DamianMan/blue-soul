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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ContextData } from "../context/ContextDataProvider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button, Divider, FAB, TextInput } from "react-native-paper";
import FabActivitiesItem from "../components/FabActivitiesItem";
import UploadImageItem from "../components/UploadImageItem";
import axios from "axios";
import ServiceActivityItem from "../components/ServiceActivityItem";
import Loader from "../components/Loader";
import { API_KEY_PROTECTED } from "@env";

const { height, width } = Dimensions.get("window");
function editActivities(props) {
  const { services, getServices, addItem, removeItem, loading } =
    useContext(ContextData);
  const [display, setDisplay] = useState(false);
  const [pressed, setPressed] = useState(true);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");
  const [activities, setActivities] = useState(false);
  const [newActivity, setNewActivity] = useState("");
  const [food, setFood] = useState(false);
  const [newFood, setNewFood] = useState("");
  const [drinks, setDrinks] = useState(false);
  const [newDrinks, setNewDrinks] = useState("");

  const loadService = async () => {
    await getServices();
  };
  useEffect(() => {
    loadService();
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
      if (currentActivity.namesActivities) {
        if (currentActivity.namesActivities.length > 0) {
          setActivities(currentActivity.namesActivities);
        } else {
          setActivities(false);
        }
      }
      if (currentActivity.foods && currentActivity.drinks) {
        if (
          currentActivity.foods.length > 0 &&
          currentActivity.drinks.length > 0
        ) {
          setDrinks(currentActivity.drinks);
          setFood(currentActivity.foods);
        } else {
          setDrinks(false);
          setFood(false);
        }
      }

      setPressed(true);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/editService",
          {
            id,
            name,
            subtitle,
            description,
            images,
            food,
            drinks,
            activities,
            newFood,
            newDrinks,
            newActivity,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
          if (newActivity !== "") {
            addItem(setActivities, newActivity);
            setNewActivity("");
          } else {
            newFood !== "" && addItem(setFood, newFood);
            newDrinks !== "" && addItem(setDrinks, newDrinks);
            setNewFood("");
            setNewDrinks("");
          }
        })
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
          "https://blue-soul-app.onrender.com/api/deleteImage",
          { idService, imageUrl },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY_PROTECTED,
            },
          }
        )
        .then((res) => Alert.alert(res.data.status, res.data.message))
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      console.log("Error Request:", error);
    }
  };

  const handleDeleteNameService = async (
    idService,
    newActivity,
    food,
    drink
  ) => {
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/deleteNameService",
          { idService, newActivity, food, drink },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (err) {
      Alert.alert("Error Request", err);
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

  if (loading) {
    return <Loader />;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : height}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ backgroundColor: "#F3F3F3" }}>
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
            Tap On The <Text style={styles.activity}>Service</Text> You Want To
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
        </View>

        {display && (
          <View style={styles.activityView}>
            <Text style={styles.activityTitle}>{name}</Text>
            <TextInput
              value={name}
              label={"Name"}
              textColor="#303841"
              activeOutlineColor="#2185D5"
              autoCapitalize="none"
              onChangeText={(text) => setName(text)}
              mode="outlined"
              style={styles.userInput}
              disabled
            />
            <TextInput
              value={subtitle}
              label={"Subtitle"}
              textColor="#303841"
              activeOutlineColor="#2185D5"
              autoCapitalize="none"
              onChangeText={(text) => setSubtitle(text)}
              mode="outlined"
              multiline={true}
              style={styles.userInput}
            />
            <TextInput
              value={description}
              label={"Description"}
              textColor="#303841"
              activeOutlineColor="#2185D5"
              autoCapitalize="none"
              onChangeText={(text) => setDescription(text)}
              mode="outlined"
              multiline={true}
              style={styles.userInput}
            />
            <View style={styles.listHorizontal}>
              <Text style={styles.imagesTitle}>Images For {name}</Text>
              <FlatList
                horizontal
                data={images}
                renderItem={({ item }) => <ItemImage url={item} id={id} />}
                keyExtractor={(item) => item}
              />
            </View>

            <UploadImageItem uploadImage={uploadImage} />
            <View
              style={[
                styles.listHorizontal,
                { marginLeft: 0, paddingHorizontal: 5 },
              ]}
            >
              {activities && (
                <View style={styles.namesServiceView}>
                  <Text style={styles.titleNamesActivity}>For {name}</Text>

                  <FlatList
                    horizontal
                    data={activities}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <ServiceActivityItem
                        handleDelete={handleDeleteNameService}
                        id={id}
                        newActivity={item}
                        name={item}
                        categoryName={name}
                        removeItem={removeItem}
                        setActivities={setActivities}
                      />
                    )}
                    keyExtractor={(item) => item}
                  />
                  <TextInput
                    value={newActivity}
                    label={`New ${name} To Add`}
                    textColor="#303841"
                    activeOutlineColor="#2185D5"
                    autoCapitalize="none"
                    onChangeText={(text) => setNewActivity(text)}
                    mode="outlined"
                    multiline={true}
                    style={styles.userInput}
                  />
                </View>
              )}
              {food && (
                <View style={styles.namesServiceView}>
                  <Text style={styles.titleNamesActivity}>For Food</Text>

                  <FlatList
                    horizontal
                    data={food}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <ServiceActivityItem
                        handleDelete={handleDeleteNameService}
                        removeItem={removeItem}
                        setFood={setFood}
                        id={id}
                        food={item}
                        name={item}
                        categoryName={name}
                      />
                    )}
                    keyExtractor={(item) => item}
                  />
                  <TextInput
                    value={newFood}
                    label={`New Food To Add`}
                    textColor="#303841"
                    activeOutlineColor="#2185D5"
                    autoCapitalize="none"
                    onChangeText={(text) => setNewFood(text)}
                    mode="outlined"
                    multiline={true}
                    style={styles.userInput}
                  />
                </View>
              )}
              {drinks && (
                <View style={styles.namesServiceView}>
                  <Text style={styles.titleNamesActivity}>For Drinks</Text>

                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={drinks}
                    renderItem={({ item }) => (
                      <ServiceActivityItem
                        handleDelete={handleDeleteNameService}
                        removeItem={removeItem}
                        setDrinks={setDrinks}
                        id={id}
                        drink={item}
                        name={item}
                        categoryName={name}
                      />
                    )}
                    keyExtractor={(item) => item}
                  />
                  <TextInput
                    value={newDrinks}
                    label={`New Drink To Add`}
                    textColor="#303841"
                    activeOutlineColor="#2185D5"
                    autoCapitalize="none"
                    onChangeText={(text) => setNewDrinks(text)}
                    mode="outlined"
                    multiline={true}
                    style={styles.userInput}
                  />
                </View>
              )}
            </View>
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
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    height: height / 3,
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    borderBottomRightRadius: 40, // Example of rounding On Andorid
    borderBottomLeftRadius: 40, // Example of rounding On Andorid

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
    color: "#2185D5",
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
  listHorizontal: {
    marginLeft: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  namesServiceView: {
    marginBottom: 20,
  },
  titleNamesActivity: { marginLeft: 25, color: "#2185D5" },
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
    marginTop: 20,
    backgroundColor: "#DDF2FD",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.57,
    shadowRadius: 4.65,

    elevation: 6,
  },
  titleText: {
    textAlign: "center",
    fontSize: 20,
    color: "#303841",
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
  imagesTitle: { color: "#2185D5", paddingLeft: 5 },
});

export default editActivities;
