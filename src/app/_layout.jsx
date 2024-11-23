import { ContextDataProvider } from "../context/ContextDataProvider";
import RootLayout from "./RootLayout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function Main() {
  return (
    <ContextDataProvider>
      {/* <GestureHandlerRootView style={styles.container}> */}
      <RootLayout />
      {/* </GestureHandlerRootView> */}
    </ContextDataProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the GestureHandlerRootView takes up the full screen
  },
});
