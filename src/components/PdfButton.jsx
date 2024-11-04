import React from "react";
import { Platform } from "react-native";
import { Button } from "react-native-paper";
import RNHTMLtoPDF from "react-native-html-to-pdf";
// import RNFS from "react-native-fs"; // For direct file system access
import { Alert } from "react-native";

function PdfButton({ currentUsers }) {
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
              <h1>Documents Info Users</h1>
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

    try {
      const { filePath } = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: "users_info",
        directory: Platform.OS === "android" ? dir : "Documents",
      });

      Alert.alert("PDF created at:", filePath);
      console.log(filePath);
      return filePath;
    } catch (error) {
      Alert.alert("PDF generation error:", error);
    }
  };

  return (
    <Button
      icon="file-pdf-box"
      mode="elevated"
      onPress={generatePDF}
      buttonColor="lightseagreen"
      textColor="aliceblue"
      style={{ margin: 30 }}
    >
      Generate PDF
    </Button>
  );
}

export default PdfButton;
