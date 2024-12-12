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
    primary: "dodgerblue",
    accent: "#f1c40f",
    surface: "aliceblue",
    text: "blue",
    placeholder: "dodgerblue",
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
