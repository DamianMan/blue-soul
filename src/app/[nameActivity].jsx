import React, { useContext } from "react";
import { Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams, useSegments, Stack, Tabs } from "expo-router";
import { ContextData } from "../context/ContextDataProvider";
import LogoutBtn from "../components/LogoutBtn";

function nameServiceDetail(props) {
  const params = useLocalSearchParams();
  const { services } = useContext(ContextData);

  const currentService = services.find(
    (item) => item.url === params.nameActivity
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "ivory",
      }}
    >
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
              style={{ width: 50, height: 50 }}
            />
          ),
          headerStyle: {
            backgroundColor: "lightblue",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Text>{currentService.name}</Text>
      <Text>{currentService.subTitle}</Text>
      <Text>{currentService.description}</Text>
    </ScrollView>
  );
}

export default nameServiceDetail;
