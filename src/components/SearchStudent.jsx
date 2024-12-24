import { useState } from "react";
import { Searchbar } from "react-native-paper";

function SearchStudent({
  searchQuery,
  setSearchQuery,
  user,
  setSearchedStudent,
}) {
  const handleChange = (text) => {
    const currentUser = user.find(
      (item) => item.fullName.toLowerCase() === text.toLowerCase()
    );
    if (currentUser) setSearchedStudent(currentUser);
    else setSearchedStudent();
    setSearchQuery(text);
  };
  return (
    <Searchbar
      placeholder="Search Student..."
      onChangeText={handleChange}
      value={searchQuery}
      selectionColor={"dodgerblue"}
      style={{ backgroundColor: "#fff", marginHorizontal: 20 }}
      iconColor="dodgerblue"
    />
  );
}

export default SearchStudent;
