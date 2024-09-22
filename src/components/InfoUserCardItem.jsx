import React from "react";
import { View, StyleSheet, Image, Dimensions, Pressable } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import { Link, router } from "expo-router";

const { width } = Dimensions.get("window");

function InfoUserCardItem({ src, title, text, nameActivity }) {
  return (
    <Link href={`${nameActivity}`} asChild>
      <Pressable style={styles.card}>
        <Card style={styles.cardStyle}>
          <Card.Content
            style={{
              margin: 15,
              marginBottom: 8,
              backgroundColor: "aliceblue",
              borderRadius: 10,
            }}
          >
            <Text
              variant="titleLarge"
              style={{ color: "darkblue", letterSpacing: 1 }}
            >
              {title}
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              {text}
            </Text>
          </Card.Content>
          <Card.Cover source={{ uri: src }} style={{ marginHorizontal: 15 }} />
          <Card.Actions>
            <Button
              mode="contained-tonal"
              buttonColor="orangered"
              textColor="#fff"
              contentStyle={{ flexDirection: "row-reverse" }}
              icon={() => (
                <Feather name="arrow-right-circle" size={24} color="#fff" />
              )}
            >
              Explore
            </Button>
          </Card.Actions>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 30,
  },
  cardStyle: {
    width: (width * 90) / 100,
    backgroundColor: "skyblue",
    shadowColor: "darkblue",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14,
  },
  image: {
    height: 200,
    resizeMode: "cover",
  },
  text: {
    color: "royalblue",

    fontWeight: "lighter",
    letterSpacing: 1,
    paddingBottom: 10,
  },
});

export default InfoUserCardItem;
