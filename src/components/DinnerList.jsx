import React from "react";
import { FlatList, Dimensions } from "react-native";
import DinnerListItem from "./DinnerListItem";

const { width } = Dimensions.get("window");
function DinnerList({ data, handleUpdateDinner, type }) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item}
      style={{ marginVertical: 30 }}
      renderItem={({ item }) => (
        <DinnerListItem
          item={item}
          handleUpdateDinner={handleUpdateDinner}
          data={data}
          type={type}
        />
      )}
    />
  );
}

export default DinnerList;
