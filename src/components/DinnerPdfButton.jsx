import React from "react";
import { Button } from "react-native-paper";

import { useState } from "react";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

function DinnerPdfButton({ currentUsers, textBtn, event, date }) {
  const [selectedPrinter, setSelectedPrinter] = useState();

  const generateUserHTML = (users) => {
    let dateArray = date.split("-");
    dateArray.reverse();
    const [day, month, year] = dateArray;
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
              <h1>${event} ${day}-${month}-${year}  </h1>
              <table>
                <tr>
                    <th>Name</th>
                    <th>First Dish</th>
                    <th>Second Dish</th>
                    <th>Side</th>
                   


                </tr>
                ${users
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.fullName}</td>
                        <td>${
                          item.dinner ? item.dinner[date].firstDish : "None"
                        }</td>
                        <td>${
                          item.dinner ? item.dinner[date].secondDish : "None"
                        }</td>
                        <td>${
                          item.dinner ? item.dinner[date].side : "None"
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

    // On iOS/android prints the given html. On web prints the HTML from the current page.
    console.log("generating pdf...");
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
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

export default DinnerPdfButton;
