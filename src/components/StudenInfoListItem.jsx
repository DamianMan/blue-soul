import React, { useState } from "react";
import { Text, View, StyleSheet, ImageBackground, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";

function StudenInfoListItem({ data }) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullname] = useState(data.fullName);
  const [email, setEmail] = useState(data.email);
  const [address, setAddress] = useState(data.address);
  const [city, setCity] = useState(data.city);
  const [phone, setPhone] = useState(data.phone);
  const [numDocument, setNumDocument] = useState(data.numDocument);

  const handleSubmit = async () => {
    try {
      await axios
        .post(
          "http://192.168.1.63:3000/api/updateUser",
          {
            fullName,
            address,
            email,
            city,
            phone,
            numDocument,
          },
          {
            headers: {
              "Content-Type": "application/json", // Default for JSON payload
            },
          }
        )
        .then((response) => {
          Alert.alert("Success", response.data.message);
          setIsDisabled(!isDisabled);
          setIsEditing(!isEditing);
        })
        .catch((err) => console.error("Error posting data:", err));
    } catch (error) {
      console.error("Error Initialing Request:", error);
    }
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  modalText: {
    color: "darkblue",
  },
  input: {
    color: "#0E46A3",
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
