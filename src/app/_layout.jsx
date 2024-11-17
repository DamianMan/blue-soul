import { ContextDataProvider } from "../context/ContextDataProvider";
import RootLayout from "./RootLayout";

export default function Main() {
  return (
    <ContextDataProvider>
      <RootLayout />
    </ContextDataProvider>
  );
}
