import React from "react";
import { View, Text } from "react-native";

function CountDownItem({ remainingTime }) {
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  if (remainingTime === 0) {
    return (
      <Text style={{ fontSize: 9, color: "red" }}>
        {hours < 10 ? `0${hours}` : hours}:
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </Text>
    );
  }
  return (
    <View>
      <Text style={{ fontSize: 9, fontWeight: "bold" }}>
        {remainingTime !== 0 &&
          `${hours < 10 ? `0${hours}` : hours}:${
            minutes < 10 ? `0${minutes}` : minutes
          }:${seconds < 10 ? `0${seconds}` : seconds}`}
      </Text>
    </View>
  );
}

export default CountDownItem;
