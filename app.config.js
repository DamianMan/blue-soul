export default {
  expo: {
    name: "BlueSoul",
    slug: "blue-soul-app",
    scheme: "BlueSoul-App",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.blueSoul.firebaseApp",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        NSUserNotificationsUsageDescription:
          "Allow notifications to stay up to date. These can be configured from the System Settings.",
      },
    },
    android: {
      permissions: ["WRITE_EXTERNAL_STORAGE", "POST_NOTIFICATIONS"],

      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#ffffff",
      },
      package: "com.blueSoul.firebaseApp",
      versionCode: 1,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      favicon: "./assets/logo.png",
      web: {
        bundler: "metro",
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
    ],
    extra: {
      eas: {
        projectId: "720f0423-e117-420e-b7d6-e7be3a11f842",
      },
    },
    owner: "damianomanzillo",
  },
};
