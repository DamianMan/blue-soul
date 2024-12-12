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

const { height, width } = Dimensions.get("window");

function events(props) {
  const { programs } = useContext(ContextData);
  const [visible, setVisible] = useState(false);

  const handlePress = () => {
    setVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={programs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <EventItem title={item.title} hour={item.hour} id={item._id} />
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width,
  },
  list: {
    padding: 15,

    height: height / 2,
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
