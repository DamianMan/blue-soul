import React from "react";
import { Platform } from "react-native";
import { Button } from "react-native-paper";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs"; // For direct file system access
import { Alert } from "react-native";
import { useState } from "react";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

function PdfButton({
  currentUsers,
  textBtn = "Generate PDF",
  event = "Check-In",
}) {
  const [selectedPrinter, setSelectedPrinter] = useState();

  const generateUserHTML = (users) => {
    return `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; }
                h1 { text-align: center; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h1>Documents ${event} Users</h1>
              <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Phone</th>
                    <th>Num Document</th>


                </tr>
                ${users
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.fullName}</td>
                        <td>${item.email}</td>
                        <td>${item.address}</td>
                        <td>${item.city}</td>
                        <td>${item.phone}</td>
                        <td>${
                          (item.isId && "ID") ||
                          (item.isPassport && "PASSPORT") ||
                          (!item.isId && !item.isPassport && "")
                        } - ${
                      item.numDocument === undefined ? "" : item.numDocument
                    }</td>
                      </tr>
                    `
                  )
                  .join("")}
              </table>
            </body>
          </html>
        `;
  };

  const generatePDF = async () => {
    const htmlContent = generateUserHTML(currentUsers);
    // const dir = RNFS.DocumentDirectoryPath; // Get the Document Directory Path for Android
    // const fileName = "users_info.pdf";

    // const filePath2 =
    //   Platform.OS === "android"
    //     ? `${RNFS.DownloadDirectoryPath}/${fileName}`
    //     : `${RNFS.DocumentDirectoryPath}/${fileName}`;

    // try {
    //   const { filePath } = await RNHTMLtoPDF.convert({
    //     html: htmlContent,
    //     fileName: "users_info",
    //     directory: Platform.OS === "android" ? "Dowloads" : "Documents",
    //     path: filePath2,
    //   });

    //   Alert.alert("PDF created at:", filePath2);
    //   console.log(filePath2);
    //   return filePath;
    // } catch (error) {
    //   Alert.alert("PDF generation error:", error);
    // }

    // On iOS/android prints the given html. On web prints the HTML from the current page.
    console.log("generating pdf...");
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });

    // const printToFile = async () => {
    //   // On iOS/android prints the given html. On web prints the HTML from the current page.
    //   const { uri } = await Print.printToFileAsync({ html });
    //   console.log("File has been saved to:", uri);
    // };

    // const selectPrinter = async () => {
    //   const printer = await Print.selectPrinterAsync(); // iOS only
    //   setSelectedPrinter(printer);
    // };
  };

  return (
    <Button
      icon="file-pdf-box"
      mode="elevated"
      onPress={generatePDF}
      buttonColor="lightseagreen"
      textColor="aliceblue"
    >
      {textBtn}
    </Button>
  );
}

export default PdfButton;
