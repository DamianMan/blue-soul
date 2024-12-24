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
  Modal,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TeacherCardItem from "../components/TeacherCardItem";
import { ContextData } from "../context/ContextDataProvider";
import CustomCarousel from "../components/CustomCarousel";
import { Button, Chip, Divider } from "react-native-paper";
import StudentChipItem from "../components/StudentChipItem";
import PdfButton from "../components/PdfButton";
import FilterDatesForm from "../components/FilterDatesForm";
import CalendarAdmin from "../components/CalendarAdmin";
import SearchStudent from "../components/SearchStudent";
import auth from "@react-native-firebase/auth";
import Loader from "../components/Loader";

const { height } = Dimensions.get("window");

function checkEditGroup(props) {
  const { users, loading, programs, groups } = useContext(ContextData);
  const isAdmin = auth().currentUser.email === "admin@mail.com";

  const [filteredGroups, setFilteredGroups] = useState([]);
  const [group, setGroup] = useState();
  const [user, setUser] = useState([]);
  const [groupToken, setGroupToken] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [agendaList, setAgendaList] = useState();
  const [date, setDate] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedStudent, setSearchedStudent] = useState();

  // Get All Groups
  useEffect(() => {
    console.log("Groups state updated:");
    const filteredGroups = groups.filter((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      if (item.startDate || item.endDate) {
        if (date >= startDate && date <= endDate) {
          return item;
        }
      }
    });
    if (filteredGroups.length > 0) {
      setFilteredGroups(filteredGroups);

      handlePress(groupToken, filteredGroups); // Trigger handlePress after data is loaded

      console.log("Filetere Group 1:", filteredGroups[0].program);
    }
  }, [groups]);

  useEffect(() => {
    console.log("FilteredGroups state updated:");
  }, [filteredGroups]);

  // useEffect(() => {
  //   const loadAndHandlePress = async () => {
  //     try {
  //       // Fetch data first
  //       await getUsers();
  //       await getGroups();

  //       // Then handle the group processing
  //       if (groupToken !== "") {
  //         // handlePress(groupToken, filteredGroups); // Trigger handlePress after data is loaded
  //         console.log("Reloading!!!");
  //       }
  //     } catch (error) {
  //       console.error("Error during load and handlePress:", error);
  //     }
  //   };

  //   loadAndHandlePress();
  // }, [reload]); // Triggered when reload changes

  // const  = async () => {
  //   setReload((prevReload) => !prevReload); // Ensures state consistency

  //   console.log("Reload toggled!");
  // };
  const ITEMS = (programs, data) => {
    const transformedData = {}; // New object to store transformed values

    for (const [key, value] of Object.entries(data)) {
      const newValues = value.map((item) =>
        programs.find((pr) => item === pr._id)
      );
      transformedData[key] = value;
    }
    return transformedData;
  };

  const handlePress = (token, filteredGroups) => {
    const currentGroup = filteredGroups.find(
      (item) => item.tokenGroup === token
    );

    if (!currentGroup) {
      alert("No Group Found!");
      return;
    }

    setGroupToken(token);
    setGroup(currentGroup);

    // Update agendaList using the latest program and programs
    if (currentGroup.program) {
      const updatedAgenda = ITEMS(programs, currentGroup.program);
      console.log("UPDATED program:", updatedAgenda);

      setAgendaList(updatedAgenda);
    } else {
      console.log("No program found for the current group");
    }

    // Update users related to the group
    const currentUsers = users.filter((item) => item.tokenGroup === token);
    if (currentUsers.length > 0) {
      setUser(currentUsers);
    } else {
      alert("No Users Found");
    }
  };

  if (loading) {
    return <Loader />;
  }
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
      <View>
        <FilterDatesForm
          filteredGroup={filteredGroups}
          setFilteredGroups={setFilteredGroups}
          groups={groups}
          date={date}
          setDate={setDate}
        />

        {filteredGroups.length > 0 && (
          <>
            <Text
              style={[
                styles.titleText,
                {
                  letterSpacing: 0,
                  padding: 10,
                  marginTop: 20,
                  fontSize: 18,
                },
              ]}
            >
              Tap On The <Text style={styles.group}>Group</Text> To Check And
              Edit
            </Text>
            <MaterialCommunityIcons
              name="gesture-tap"
              size={50}
              color="#3FA2F6"
              style={{ alignSelf: "center" }}
            />

            <CustomCarousel
              data={filteredGroups || groups}
              handlePress={handlePress}
              setTeacher={setGroup}
              setUsers={setUser}
              setFilteredGroups={setFilteredGroups}
            />
          </>
        )}
      </View>

      <View>
        {group && (
          <View>
            <Button
              icon={"calendar"}
              mode="outlined"
              textColor="lightseagreen"
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.programBtn}
            >
              Show Program
            </Button>
            <Modal
              animationType="slide"
              presentationStyle="fullScreen"
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <CalendarAdmin
                agendaList={agendaList}
                setModalVisible={setModalVisible}
                idGroup={group._id}
              />
            </Modal>
            <Text style={[styles.titleText, { color: "#2185D5" }]}>
              TEACHER
            </Text>
            <TeacherCardItem
              idGroup={group._id}
              teacher={group.fullNameTeacher}
              email={group.email}
              phone={group.phone}
              city={group.city}
              token={group.tokenGroup}
              numOfPeople={group.peopleCount}
              startDate={group.startDate}
              endDate={group.endDate}
            />
          </View>
        )}
        {user.length > 0 && group && (
          <>
            <View style={{ paddingVertical: 10 }}>
              <Divider style={styles.divider} />
              <Text style={[styles.titleText, { paddingBottom: 20 }]}>
                STUDENTS ({user.length}/{group.peopleCount}
                <Text style={{ fontSize: 10 }}>teacher incl.</Text>)
              </Text>
              <SearchStudent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                user={user}
                setSearchedStudent={setSearchedStudent}
              />
              {searchedStudent && (
                <StudentChipItem
                  key={searchedStudent.tokenGroup + searchedStudent.fullName}
                  data={searchedStudent}
                />
              )}
              <View
                style={{
                  marginTop: 40,
                  marginBottom: 20,
                  marginHorizontal: 20,
                }}
              >
                {isAdmin && (
                  <PdfButton
                    currentUsers={user}
                    textBtn="Generate Group PDF Documents"
                  />
                )}
              </View>
            </View>
          </>
        )}
      </View>
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
  programBtn: {
    borderColor: "lightseagreen",
    margin: 20,
  },
});

export default checkEditGroup;
