import React from "react";
import { FlatList } from "react-native";
import DinnerListItem from "./DinnerListItem";

function DinnerList({ data, handleUpdateDinner, type }) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item}
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
