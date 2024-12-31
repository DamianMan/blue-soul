import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { BlurView } from "expo-blur";
import { IconButton } from "react-native-paper";
import axios from "axios";
import { ContextData } from "../context/ContextDataProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import auth from "@react-native-firebase/auth";

const { width } = Dimensions.get("window");

const COLORS = [
  "lightblue",
  "lightskyblue",
  "lightsteelblue",
  "lightgray",
  "lightslategrey",
];

const getRandomColor = () => {
  let randomColor = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomColor];
};

const CustomCarousel = ({
  data,
  handlePress,
  setTeacher,
  setUsers,
  setFilteredGroups,
}) => {
  const isAdmin = auth().currentUser.email === "admin@mail.com";
  const { removeItemComplexArray, fetchData } = useContext(ContextData);
  const [group, setGroup] = useState(data);

  const handleDeleteGroup = async (id, email) => {
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/deleteGroup",
          { id, email },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          Alert.alert(res.data.status, res.data.message);
          removeItemComplexArray(setGroup, group, id);
          setTeacher();
          setUsers([]);
          setFilteredGroups([]);
          fetchData();
        })
        .catch((err) => Alert.alert(err.data.status, err.data.message));
    } catch (error) {
      alert("Error Request deleting group:", error);
    }
  };

  return (
    <View>
      <Carousel
        style={styles.carousel}
        width={width}
        height={width / 2}
        data={group}
        enabled={group.length > 1 ? true : false}
        mode={group.length > 1 ? "parallax" : "default"}
        onSnapToItem={(item) => {
          handlePress(group[item].tokenGroup, data);
        }}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            style={{
              justifyContent: "center",
              borderRadius: 30,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 1.84,
              elevation: 5,
            }}
            onPress={() => {
              handlePress(item.tokenGroup, data);
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
                uri: "https://img.freepik.com/free-vector/watercolor-painted-malaga-skyline_52683-71499.jpg?ga=GA1.1.609292962.1726606020&semt=ais_hybrid",
              }}
            >
              {isAdmin && (
                <IconButton
                  icon="delete-forever"
                  iconColor={"red"}
                  mode="outlined"
                  size={35}
                  onPress={() => handleDeleteGroup(item._id, item.email)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 10,
                    zIndex: 10,
                  }}
                />
              )}

              <BlurView
                intensity={30}
                style={[
                  styles.blurContainer,
                  { backgroundColor: `${getRandomColor()}` },
                ]}
              >
                <Text style={styles.textCarousel}>{item.nameGroup}</Text>
              </BlurView>
              <View
                style={{
                  position: "absolute",
                  bottom: 5,
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "aliceblue",
                  borderBottomLeftRadius: 58,
                  borderBottomRightRadius: 58,

                  width: (width * 90) / 100,
                }}
              >
                <FontAwesome name="hotel" size={30} color="dodgerblue" />
                <Text style={{ fontSize: 22, marginLeft: 10 }}>
                  {item.hotel}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 250,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  blurContainer: {
    padding: 30,
    margin: 16,
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
    width: width,
    opacity: 0.6,
  },
  textCarousel: {
    textAlign: "center",
    fontSize: 30,
    position: "absolute",
    alignSelf: "center",
    color: "#141E46",
    letterSpacing: 2,
  },
});

export default CustomCarousel;
