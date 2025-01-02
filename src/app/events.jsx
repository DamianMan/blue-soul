import React, { useContext, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { ContextData } from "../context/ContextDataProvider";
import EventItem from "../components/EventItem";
import { Button } from "react-native-paper";
import DialogAddEvent from "../components/DialogAddEvent";
import Loader from "../components/Loader";

const { height, width } = Dimensions.get("window");

function events(props) {
  const { programs, loading } = useContext(ContextData);
  const [visible, setVisible] = useState(false);
  console.log("Programs:", programs);

  const handlePress = () => {
    setVisible((prev) => !prev);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
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
    backgroundColor: "aliceblue",
  },
  list: {
    padding: 15,

    height: height / 1.5,
    backgroundColor: "#fff",
  },
  addButtonView: {
    flex: 1,
    marginTop: 50,
    justifyContent: "flex-start",
    alignSelf: "center",
  },
});

export default events;
