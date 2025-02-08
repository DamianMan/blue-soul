import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  ImageBackground,
  FlatList,
  SafeAreaView,
} from "react-native";
import { TextInput, Divider } from "react-native-paper";
import { ContextData } from "../context/ContextDataProvider";
import FoodDrinkListUserItem from "./FoodDrinkListUserItem";
import axios from "axios";
import auth from "@react-native-firebase/auth";
import { API_KEY_PROTECTED } from "@env";

const { width, height } = Dimensions.get("window");
function FoodDrinkNotifModal({ status, setIsNotification }) {
  const user = auth().currentUser;
  const { services, fetchData } = useContext(ContextData);

  const [userPicks, setUSerPicks] = useState([]);

  const service = services.find((item) => item.name === "Food & Drink");

  const storeUserPicks = (item) => {
    setUSerPicks((prev) => [...prev, item]);
  };

  const deleUserPicks = (item) => {
    setUSerPicks((prev) => prev.filter((pick) => pick !== item));
  };

  const hideModal = () => {
    setIsNotification((prev) => !prev);
  };
  const handleSubmit = async () => {
    if (userPicks.length < 2) {
      alert(
        "Please Select At Least One Food Item and One Drink Item. Thank you."
      );
    } else {
      try {
        const email = user?.email;
        await axios
          .post(
            "https://blue-soul-app.onrender.com/api/postTripMeal",
            { userPicks, email },
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY_PROTECTED,
              },
            }
          )
          .then((res) => {
            Alert.alert(res.data.status, res.data.message);
            hideModal();

            fetchData();
            console.log("Getting USers after closing modal!!!");
          })
          .catch((err) => Alert.alert(err.data.status, err.data.message));
      } catch (error) {
        alert("Error Request:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={status}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModal();
        }}
      >
        <View style={styles.centeredView}>
          <ImageBackground
            resizeMode="cover"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height,
              opacity: 0.3,
            }}
            source={{
              uri: "https://images.unsplash.com/photo-1595436252086-7496fb8c41e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D",
            }}
          />
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Upcoming trip ahead... 🎒🥾</Text>
            <Text style={styles.modalText}>
              Please pick your daily meal and your drink. 🍴🥤
            </Text>
            <Text style={styles.modalText}>Have Fun! 🤩</Text>
            <Text
              style={[
                styles.modalText,
                { color: "dodgerblue", fontSize: 24, fontWeight: "bold" },
              ]}
            >
              Blue Soul Staff
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent white background
                borderRadius: 16,
                borderWidth: 1, // Border with opacity
                borderColor: "rgba(255, 255, 255, 0.3)", // Slightly white border
                shadowColor: "#000", // Shadow properties
                shadowOffset: { width: 0, height: 4 }, // Shadow offset
                shadowOpacity: 0.5, // Shadow opacity
                shadowRadius: 30, // Shadow blur radius

                padding: 20,
                marginVertical: 30,
              }}
            >
              <Text
                style={[
                  styles.modalText,
                  {
                    color: "lightseagreen",
                    fontWeight: "bold",
                    paddingBottom: 20,
                  },
                ]}
              >
                Foods
              </Text>
              <FlatList
                horizontal
                data={service.foods}
                style={{ maxHeight: 80 }}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <FoodDrinkListUserItem
                    name={item}
                    type={"food"}
                    storeUserPicks={storeUserPicks}
                    deleteUserPicks={deleUserPicks}
                  />
                )}
              />
              <Divider
                style={{
                  backgroundColor: "lightseagreen",
                  marginVertical: 20,
                  marginHorizontal: 20,
                }}
              />
              <Text
                style={[
                  styles.modalText,
                  {
                    color: "lightseagreen",
                    fontWeight: "bold",
                    paddingBottom: 20,
                  },
                ]}
              >
                Drinks
              </Text>
              <FlatList
                horizontal
                data={service.drinks}
                style={{ maxHeight: 80 }}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false} // Hide the horizontal scroll bar
                renderItem={({ item }) => (
                  <FoodDrinkListUserItem
                    name={item}
                    type={"drinks"}
                    storeUserPicks={storeUserPicks}
                    deleteUserPicks={deleUserPicks}
                  />
                )}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={handleSubmit}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={hideModal}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,

    elevation: 5,
    marginHorizontal: 5,
  },
  buttonOpen: {
    backgroundColor: "dodgerblue",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "start",
    color: "#000",
    fontSize: 20,
    letterSpacing: 1,
  },
});

export default FoodDrinkNotifModal;
