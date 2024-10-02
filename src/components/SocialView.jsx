import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const socialMediaArray = [
  { name: "facebook" },
  { name: "instagram" },
  { name: "twitter" },
];
function SocialView(props) {
  return (
    <View style={{ paddingBottom: 30 }}>
      <View style={styles.socialContainer}>
        <FlatList
          horizontal={true}
          data={socialMediaArray}
          renderItem={({ item }) => (
            <Button
              key={item.name}
              mode="contained"
              icon={({ size, color }) => (
                <Icon name={item.name} size={30} color="#00e0ff" /> // Custom icon color
              )}
              labelStyle={{
                color: "#FF9F66",
                fontSize: 40,
              }}
              style={styles.socialIcon}
            ></Button>
          )}
          keyExtractor={(item) => item.name}
        />
      </View>
    </View>
  );
}

export default SocialView;

const styles = StyleSheet.create({
  socialContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  socialIcon: {
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 5,
  },
});
