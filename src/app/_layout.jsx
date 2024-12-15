import { ContextDataProvider } from "../context/ContextDataProvider";
import RootLayout from "./RootLayout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { PaperProvider, DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "dodgerblue", // Active button color
    surface: "aliceblue", // Background color for buttons
    text: "blue", // Text color
    placeholder: "dodgerblue", // Placeholder color (if used)
    primaryContainer: "lightskyblue", // Background for active button
    secondaryContainer: "lightskyblue", // Optionally define for inactive button
  },
};
export default function Main() {
  return (
    <ContextDataProvider>
      {/* <GestureHandlerRootView style={styles.container}> */}
      <PaperProvider theme={theme}>
        <RootLayout />
      </PaperProvider>

      {/* </GestureHandlerRootView> */}
    </ContextDataProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the GestureHandlerRootView takes up the full screen
  },
});
