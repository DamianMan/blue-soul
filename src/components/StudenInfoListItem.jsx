import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { Badge, Button, Chip, TextInput } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { useContext } from "react";
import { ContextData } from "../context/ContextDataProvider";
import { API_KEY_PROTECTED } from "@env";

const { height } = Dimensions.get("window");

function StudenInfoListItem({ data }) {
  const { fetchData } = useContext(ContextData);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullname] = useState(data.fullName);
  const [email, setEmail] = useState(data.email);
  const [address, setAddress] = useState(data.address);
  const [city, setCity] = useState(data.city);
  const [phone, setPhone] = useState(data.phone);
  const [numDocument, setNumDocument] = useState(data.numDocument);
  const [foodDrink, setFoodDrink] = useState(data.tripFoodDrink);

  const handleFoodDrink = (text, index) => {
    const newArray = [...foodDrink];
    newArray[index] = text;
    setFoodDrink(newArray);
  };

  const handleSubmit = async () => {
    try {
      await axios
        .post(
          "https://blue-soul-app.onrender.com/api/updateUser",
          {
            fullName,
            address,
            email,
            city,
            phone,
            numDocument,
            foodDrink,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY_PROTECTED,
            },
          }
        )
        .then((response) => {
          Alert.alert("Success", response.data.message);
          setIsDisabled(!isDisabled);
          fetchData();
        })
        .catch((err) => console.error("Error posting data:", err));
    } catch (error) {
      console.error("Error Initialing Request:", error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : height}>
      <ScrollView>
        <ImageBackground
          resizeMode="cover"
          imageStyle={{ opacity: 0.3, marginTop: 10 }}
          source={{
            uri: "https://img.freepik.com/free-photo/blue-user-icon-symbol-website-admin-social-login-element-concept-white-background-3d-rendering_56104-1217.jpg?ga=GA1.1.609292962.1726606020&semt=ais_hybrid",
          }}
        >
          <View style={styles.container}>
            <TextInput
              autoCapitalize="none"
              mode="outlined"
              activeOutlineColor="#2185D5"
              placeholder={fullName}
              disabled={isDisabled}
              label={"Full Name"}
              value={fullName}
              style={styles.input}
              contentStyle={styles.modalText}
              onChangeText={(text) => setFullname(text)}
            />
            <TextInput
              autoCapitalize="none"
              mode="outlined"
              activeOutlineColor="#2185D5"
              placeholder={data.email}
              disabled={isDisabled}
              label={"Email"}
              value={email}
              style={styles.input}
              contentStyle={styles.modalText}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              autoCapitalize="none"
              mode="outlined"
              activeOutlineColor="#2185D5"
              placeholder={address}
              disabled={isDisabled}
              label={"Address"}
              value={address}
              style={styles.input}
              contentStyle={styles.modalText}
              onChangeText={(text) => setAddress(text)}
            />
            <TextInput
              autoCapitalize="none"
              mode="outlined"
              activeOutlineColor="#2185D5"
              placeholder={city}
              disabled={isDisabled}
              label={"City"}
              value={city}
              style={styles.input}
              contentStyle={styles.modalText}
              onChangeText={(text) => setCity(text)}
            />
            <TextInput
              autoCapitalize="none"
              mode="outlined"
              activeOutlineColor="#2185D5"
              placeholder={phone}
              disabled={isDisabled}
              label={"Phone"}
              value={phone}
              style={styles.input}
              contentStyle={styles.modalText}
              onChangeText={(text) => setPhone(text)}
            />

            <TextInput
              mode="outlined"
              activeOutlineColor="#2185D5"
              autoCapitalize="none"
              placeholder={numDocument}
              disabled={isDisabled}
              label={
                (data.isId && "ID") ||
                (data.isPassport && "Passport") ||
                "Number Document"
              }
              value={numDocument}
              style={styles.input}
              contentStyle={styles.modalText}
              onChangeText={(text) => setNumDocument(text)}
            />
            {data.tripFoodDrink.length > 0 && (
              <View>
                <Text
                  style={{
                    textAlign: "start",
                    color: "#2185D5",
                    fontSize: 20,
                    paddingVertical: 10,
                    fontWeight: "bold",
                  }}
                >
                  Trip Food & Drink
                  <AntDesign name="arrowdown" size={24} color="#2185D5" />
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={foodDrink}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TextInput
                      mode="contained"
                      autoCapitalize="none"
                      disabled={isDisabled}
                      value={item}
                      textColor="aliceblue"
                      style={{
                        backgroundColor: "lightseagreen",
                        borderRadius: 10,
                        paddingHorizontal: 30,
                        marginRight: 20,
                        marginVertical: 10,
                      }}
                      onChangeText={(text) => handleFoodDrink(text, index)}
                    />
                  )}
                />
              </View>
            )}
            {!isEditing ? (
              <Button
                mode="elevated"
                labelStyle={{ color: "#ffff", fontSize: 15 }}
                icon={({ size, color }) => (
                  <AntDesign name="edit" size={30} color="#fff" /> // Custom icon color
                )}
                style={styles.edit}
                onPress={() => {
                  setIsDisabled(!isDisabled);
                  setIsEditing(!isEditing);
                }}
              >
                Edit
              </Button>
            ) : (
              <Button
                mode="elevated"
                labelStyle={{ color: "#ffff", fontSize: 15 }}
                icon={({ size, color }) => (
                  <AntDesign name="database" size={30} color="#fff" /> // Custom icon color
                )}
                style={[styles.edit, { backgroundColor: "#3FA2F6" }]}
                onPress={handleSubmit}
              >
                Submit
              </Button>
            )}
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modalText: {
    color: "#303841",
  },
  input: {
    color: "#303841",
    marginVertical: 3,

    backgroundColor: "transparent",
  },
  edit: {
    backgroundColor: "orangered",
    elevation: 5,
    textShadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
    marginVertical: 10,
  },
});

export default StudenInfoListItem;
