import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TaskItem from "../components/TaskItem";
import auth from "@react-native-firebase/auth";
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../context/ContextDataProvider";
import Loader from "../components/Loader";
const Tasks = [
  {
    name: "Add New Group",
    url: "addNewGroup",
    icon: "plus-square",
    isAccessible: false,
    image:
      "https://images.unsplash.com/photo-1536869338989-e7ffd2297454?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN0dWRlbnRzJTIwc2VhfGVufDB8fDB8fHww",
  },
  {
    name: "Add Program Event",
    url: "events",
    icon: "plus-square",
    isAccessible: false,
    image:
      "https://images.unsplash.com/photo-1484981184820-2e84ea0af397?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Check & Edit Group",
    url: "checkEditGroup",
    icon: "edit",
    isAccessible: true,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8",
  },
  {
    name: "Edit All Services",
    url: "editActivities",
    icon: "list-alt",
    isAccessible: false,
    image:
      "https://images.unsplash.com/photo-1444210971048-6130cf0c46cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8",
  },
];

const { width, height } = Dimensions.get("window");

function AdminPanel(props) {
  useEffect(() => {
    const currentUser = auth().currentUser;
    const isAdmin = currentUser.email === "admin@mail.com";
    isAdmin
      ? setOptions(Tasks)
      : setOptions(Tasks.filter((item) => item.isAccessible === true));
    setAdmin(isAdmin);
  }, [admin, options]);
  const [admin, setAdmin] = useState(false);
  const [options, setOptions] = useState();
  const { loading } = useContext(ContextData);
  if (loading) {
    return <Loader />;
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        style={styles.logoImage}
        source={require("../../assets/logo.png")}
        resizeMode="contain"
      >
        <LinearGradient
          // Button Linear Gradient
          colors={["#8DC6FF", "#F3F3F3", "#2185D5"]}
          start={{ x: 0.8, y: 0.3 }}
          style={styles.background}
        />
      </ImageBackground>
      <FlatList
        horizontal
        data={options}
        renderItem={({ item }) => (
          <TaskItem
            text={item.name}
            img={item.image}
            icon={item.icon}
            url={item.url}
            isAdmin={admin}
          />
        )}
        keyExtractor={(item) => item.name}
        style={styles.flat}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
}

export default AdminPanel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height / 3,
    zIndex: -10,
  },
  flat: {
    marginHorizontal: 10,
    marginVertical: 40,
  },
  logoutBtn: {
    marginBottom: 30,
    backgroundColor: "red",
  },
  logoImage: {
    height: height / 3,
    backgroundColor: "#F3F7EC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    width: width,
    elevation: 5,
  },
});
