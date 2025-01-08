import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useSegments, Stack, Tabs } from "expo-router";
import { ContextData } from "../context/ContextDataProvider";
import LogoutBtn from "../components/LogoutBtn";
import { Button, Divider } from "react-native-paper";
import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");
function nameServiceDetail(props) {
  const params = useLocalSearchParams();
  const { services, getServices } = useContext(ContextData);
  const [isHide, setIsHide] = useState(3);
  const currentService = services.find(
    (item) => item.url === params.nameActivity
  );

  const foodDrinkArray = [...currentService.foods, ...currentService.drinks];

  const ImageItem = ({ url }) => {
    return (
      <View style={styles.bgImage}>
        <Image style={styles.image} source={{ uri: url }} />
      </View>
    );
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: `${currentService.url.toUpperCase()}`,
          headerShown: true,
          headerRight: () => <LogoutBtn />,
          headerBackTitleVisible: false,
          headerTitle: (props) => (
            <Image
              source={require("../../assets/logo.png")}
              resizeMode="contain"
              style={{ width: 130, height: 130, position: "absolute" }}
            />
          ),
          headerTitleAlign: "center", // Center the logo

          headerStyle: {
            backgroundColor: "aliceblue",
          },
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <ScrollView
        style={{
          backgroundColor: "#F3F3F3",
          flex: 1,
        }}
      >
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.57,
            shadowRadius: 4.65,

            elevation: 6,
          }}
        >
          <Image
            style={styles.imageBg}
            resizeMode="cover"
            source={{
              uri: `${currentService.mainImage}`,
            }}
          />
          <BlurView intensity={60} tint="light" style={styles.introTitle}>
            <Text style={styles.title}>{currentService.name}</Text>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "aliceblue",
                padding: 10,
                shadowColor: "#3A4750",
                shadowOffset: {
                  width: 1,
                  height: 3,
                },
                shadowOpacity: 0.65,
                shadowRadius: 2.84,

                elevation: 5,
              }}
            >
              <MaterialCommunityIcons
                name={`${
                  params.nameActivity === "sports"
                    ? "surfing"
                    : params.nameActivity === "activities"
                    ? "diving-scuba-tank-multiple"
                    : params.nameActivity === "foodDrink" && "food-fork-drink"
                }`}
                size={36}
                color="#2185D5"
              />
            </View>
          </BlurView>
        </View>

        <View style={styles.container}>
          <FlatList
            style={styles.imagesList}
            horizontal
            showsHorizontalScrollIndicator={false} // Hide the horizontal scroll bar
            data={currentService.images}
            renderItem={({ item }) => (
              <ImageItem url={item} style={styles.imageContainer} />
            )}
            keyExtractor={(item) => item}
          />
        </View>
        <View style={styles.subtitleView}>
          <Text style={styles.subtitle}>{currentService.subTitle}</Text>
        </View>
        <Divider style={{ margin: 20 }} />
        <View>
          <Text style={styles.sectionText}>
            You Could {params.nameActivity === "foodDrink" ? "Have" : "Do"}
          </Text>
          <FlatList
            horizontal
            style={styles.namesActivities}
            showsHorizontalScrollIndicator={false} // Hide the horizontal scroll bar
            data={
              params.nameActivity !== "foodDrink"
                ? currentService.namesActivities
                : foodDrinkArray
            }
            renderItem={({ item }) => (
              <Button
                mode="elevated"
                buttonColor="#2185D5"
                textColor="#fff"
                style={styles.sportsName}
              >
                {item}{" "}
              </Button>
            )}
            keyExtractor={(item) => item}
          />
        </View>
        <Divider style={{ margin: 20 }} />
        <View>
          <Text style={styles.sectionText}>What You Will Have From Us</Text>
        </View>
        <View style={styles.secondContainer}>
          <Text
            style={[styles.subtitle, { color: "#3A4750" }]}
            numberOfLines={isHide}
          >
            {currentService.description}
          </Text>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Button
              contentStyle={{
                alignSelf: "center",
                backgroundColor: "transparent",
              }}
              icon={"eye-circle"}
              mode="elevated"
              textColor="#0066CC"
              onPress={() => (isHide === 3 ? setIsHide(null) : setIsHide(3))}
            >
              See {isHide === null ? "Less" : "More"}
            </Button>
          </View>
        </View>
        <Divider style={{ margin: 20 }} />

        <View style={styles.regards}>
          <Text style={styles.enjoy}>HAVE FUN!</Text>
          <Text style={styles.enjoy}>... AND ENJOY YOUR VISIT</Text>

          <Text style={styles.staff}>Blue Soul Staff</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: height / 3.5,

    marginBottom: 30,
  },
  secondContainer: {
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: "aliceblue",
    shadowColor: "#2185D5",
    shadowOffset: {
      width: 3,
      height: 1,
    },
    shadowOpacity: 0.57,
    shadowRadius: 4.65,

    elevation: 6,
    margin: 20,
  },
  imageBg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    height: height / 2,
    borderEndStartRadius: 30,
    borderEndEndRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  introTitle: {
    overflow: "hidden",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 50,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  image: {
    width: 250,
    height: 200,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  bgImage: {
    paddingVertical: 18,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    backgroundColor: "aliceblue",
    shadowColor: "#2185D5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sportsName: {
    marginHorizontal: 20,
    marginVertical: 1,
  },

  namesActivities: {
    paddingVertical: 20,
    marginVertical: 1,
  },
  title: {
    fontSize: 42,
    color: "#303841",
    letterSpacing: 1,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.85,
    shadowRadius: 1.84,

    elevation: 5,
  },
  subtitle: { fontSize: 18, color: "#393E46", paddingHorizontal: 20 },
  subtitleView: {
    backgroundColor: "aliceblue",
    shadowColor: "#2185D5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 2.84,

    elevation: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 20,
  },
  sectionText: {
    textAlign: "left",
    fontSize: 20,
    color: "#222831",
    paddingLeft: 20,
  },
  regards: {
    justifyContent: "center",
    alignItems: "center",
    margin: 40,
    marginTop: 20,
  },
  enjoy: {
    fontSize: 20,
    color: "#2185D5",
  },
  staff: {
    color: "#3A4750",
    fontSize: 18,
  },
});

export default nameServiceDetail;
