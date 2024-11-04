import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TeacherCardItem from "../components/TeacherCardItem";
import { ContextData } from "../context/ContextDataProvider";
import CustomCarousel from "../components/CustomCarousel";
import { Divider } from "react-native-paper";
import StudentChipItem from "../components/StudentChipItem";
import PdfButton from "../components/PdfButton";

const { height } = Dimensions.get("window");

function checkEditGroup(props) {
  const { getUsers, getGroups, users, groups } = useContext(ContextData);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState();
  const [user, setUser] = useState([]);
  const [groupToken, setGroupToken] = useState("");
  const [reload, setReload] = useState(false);

  // Get All Groups
  useEffect(() => {
    setLoading(true);
    const loadingData = async () => {
      try {
        await getUsers();
        await getGroups();
        console.log("Users and groups loaded");
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadingData();
    if (groupToken !== "") {
      handlePress(groupToken);
      console.log("Reloading!!!");
    }
  }, [reload]);

  const toogleReload = async () => {
    setReload(!reload);
    console.log("Reload status:", !reload);
    console.log("Token:", groupToken);
    console.log("Reload Users!");
  };

  const handlePress = (token) => {
    const currentGroup = groups.find((item) => item.tokenGroup === token);
    setGroupToken(token);
    if (currentGroup) {
      setGroup(currentGroup);
    } else {
      alert("No Group Found!");
    }
    const currentUsers = users.filter((item) => item.tokenGroup === token);
    if (currentUsers.length > 0) {
      setUser(currentUsers);
      console.log("Users:", currentUsers);
    } else {
      alert("No Users Found");
    }
    setLoading(false);
  };
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        imageStyle={styles.image}
        style={styles.image}
        resizeMode="cover"
        source={{
          uri: "https://images.unsplash.com/photo-1669647561467-891414e9b140?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
        }}
      />
      <Text
        style={[
          styles.titleText,
          { letterSpacing: 0, padding: 10, marginTop: 20, fontSize: 18 },
        ]}
      >
        Tap On The <Text style={styles.group}>Group</Text> To Check And Edit
      </Text>
      <MaterialCommunityIcons
        name="gesture-tap"
        size={50}
        color="#3FA2F6"
        style={{ alignSelf: "center" }}
      />

      <CustomCarousel
        data={groups}
        handlePress={handlePress}
        setTeacher={setGroup}
        setUsers={setUser}
        setLoading={setLoading}
      />

      {loading ? (
        <ActivityIndicator size={"large"} color={"#2185D5"} />
      ) : (
        <View>
          {group && (
            <View>
              <Text style={[styles.titleText, { color: "#2185D5" }]}>
                TEACHER
              </Text>
              <TeacherCardItem
                teacher={group.fullNameTeacher}
                email={group.email}
                phone={group.phone}
                city={group.city}
                token={group.tokenGroup}
              />
            </View>
          )}
          {user.length > 0 && (
            <>
              <View style={{ paddingVertical: 30 }}>
                <Divider style={styles.divider} />
                <Text style={[styles.titleText, { paddingBottom: 20 }]}>
                  STUDENTS
                </Text>
                {user.map(
                  (item) =>
                    item.role === "Student" && (
                      <StudentChipItem
                        toogleReload={toogleReload}
                        key={item.tokenGroup + item.fullName}
                        data={item}
                      />
                    )
                )}
              </View>
              <PdfButton currentUsers={user} />
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
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
  },
  group: {
    fontSize: 20,
    color: "#2185D5",
  },
  divider: {
    marginHorizontal: 20,
    height: 1,
    borderRadius: 10,
    backgroundColor: "#3FA2F6",
    marginVertical: 30,
  },
  titleText: {
    textAlign: "center",
    fontSize: 20,
    color: "#303841",
    letterSpacing: 1,
  },
});

export default checkEditGroup;
