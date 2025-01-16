import React, { useContext, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Text,
} from "react-native";
import { ContextData } from "../context/ContextDataProvider";
import EventItem from "../components/EventItem";
import { Button, Icon } from "react-native-paper";
import DialogAddEvent from "../components/DialogAddEvent";
import Loader from "../components/Loader";

const { height, width } = Dimensions.get("window");

function events(props) {
  const { programs, loading } = useContext(ContextData);
  const [visible, setVisible] = useState(false);

  const handlePress = () => {
    setVisible((prev) => !prev);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 15 }}>
        <Icon source="playlist-edit" color={"grey"} size={30} />
      </View>

      <Text style={styles.title}>All Events List Below</Text>

      <SafeAreaView style={styles.list}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={programs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <EventItem
              title={item.title}
              hour={item.hour}
              id={item._id}
              description={item.description}
            />
          )}
        />
      </SafeAreaView>
      <View style={styles.addButtonView}>
        <Button
          icon={"plus-box-multiple"}
          mode="elevated"
          buttonColor="dodgerblue"
          textColor="#fff"
          onPress={handlePress}
        >
          Event
        </Button>
        <DialogAddEvent visible={visible} hideDialog={handlePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width,
    backgroundColor: "#fff",
  },
  list: {
    paddingVertical: 15,
    height: height / 1.5,
    backgroundColor: "#fff",
  },
  addButtonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "dodgerblue",
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default events;
