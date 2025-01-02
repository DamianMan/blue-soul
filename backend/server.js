const express = require("express");
const app = express();
const cors = require("cors");
const Users = require("./models/Users");
const Schools = require("./models/Schools");
const Services = require("./models/Services");
const Programs = require("./models/Programs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Service = require("./models/Services");
const axios = require("axios");
const admin = require("firebase-admin");
const User = require("./models/Users");

require("dotenv").config({ path: "../.env" });
// require("../blue-soul-9434a-firebase-adminsdk-yau4q-0a78a8df74.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connection Db
main().catch((err) => console.log(err));

async function main() {
  const connected = await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_URI_USER}:${process.env.MONGO_URI_PASSWORD}@cluster0.nriro.mongodb.net/BlueSoul`
  );
  if (connected) {
    console.log("Database Connected");
  }
}
app.use(express.json());

app.use(
  cors({
    origin: `*`,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST"], // List the methods you want to allow
    credentials: true,
  })
);
const port = 3000;

// const servs = [
//   {
//     name: "Sports",
//     subTitle:
//       "Aenean cursus arcu at ante volutpat, sed tincidunt nisl volutpat.",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.",
//     images: [
//       "https://images.unsplash.com/photo-1569965335962-2317ff2a7658?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHdhdGVyJTIwc3BvcnRzfGVufDB8fDB8fHww",
//       "https://images.unsplash.com/photo-1638704206515-1107ab60f641?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdpbmRzdXJmfGVufDB8fDB8fHww",
//       "https://images.unsplash.com/photo-1595323397978-65433d24fc23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8",
//     ],
//   },
//   {
//     name: "Activities",
//     subTitle:
//       "Aenean cursus arcu at ante volutpat, sed tincidunt nisl volutpat.",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.",
//     images: [
//       "https://images.unsplash.com/photo-1599828586134-fbaff96c63d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
//       "https://images.unsplash.com/photo-1474314881477-04c4aac40a0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJpb2xvZ3klMjBncm91cCUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D",
//       "https://images.unsplash.com/photo-1475483768296-6163e08872a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJpb2xvZ3klMjBncm91cCUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D",
//     ],
//   },
//   {
//     name: "Food & Drink",
//     subTitle:
//       "Aenean cursus arcu at ante volutpat, sed tincidunt nisl volutpat.",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.",
//     images: [
//       "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNwYWdlaHR0aSUyMGFuZCUyMHBpenphfGVufDB8fDB8fHww",
//       "https://images.unsplash.com/photo-1520565170521-376e52ee1d52?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNvZGFzJTIwdGFibGV8ZW58MHx8MHx8fDA%3D",
//       "https://plus.unsplash.com/premium_photo-1679591002315-cbe428ca5109?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHx8",
//     ],
//   },
// ];

// servs.forEach((element) => {
//   const newRecord = new Services({
//     name: element.name,
//     subTitle: element.subTitle,
//     description: element.description,
//     images: element.images,
//   });

//   newRecord.save();
// });

// Get All Users

app.get("/api/getUsers", async (req, res) => {
  try {
    const allUsers = await Users.find();
    res.json(allUsers);
  } catch (error) {
    res.json(error);
  }
});

// Get All Services

app.get("/api/getServices", async (req, res) => {
  try {
    const allServices = await Services.find();
    res.json(allServices);
  } catch (error) {
    res.json(error);
  }
});

// Get All Groups

app.get("/api/getAllGroups", async (req, res) => {
  try {
    const allGroups = await Schools.find();
    res.json(allGroups);
  } catch (error) {
    res.json(error);
  }
});

// Get Programs
app.get("/api/getPrograms", async (req, res) => {
  try {
    const allPrograms = await Programs.find();
    res.json(allPrograms);
  } catch (error) {
    res.json(error);
  }
});

// Get Group
// app.post("/api/getGroup", async (req, res) => {
//   const { search } = req.body;
//   const currentGroup = await Schools.findOne({ tokenGroup: search });
//   if (currentGroup) {
//     res.status(200).json({ info: currentGroup, status: true });
//   } else {
//     res.json({ msg: "No Group exists with the given Token!", status: false });
//   }
// });

// Sing Up User
app.post("/api/signUpUser", async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);

  const alreadyUserIn = await Users.findOne({ email: email });
  const isInGroup = await Schools.findOne({ tokenGroup: password });
  console.log("User Already In:", alreadyUserIn);
  if (alreadyUserIn) {
    res.json({
      message: "User Already Registered!",
      status: "Alert",
      isIn: false,
    });
  } else {
    if (isInGroup) {
      try {
        const newUser = new Users({
          fullName: fullName,
          email: email,
          password: password,
          tokenGroup: password,
          role: "Student",
          program: isInGroup.program,
        });
        await newUser.save();

        // Register Firebase User
        await admin
          .auth()
          .createUser({
            email,
            password,
            displayName: fullName,
          })
          .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log(
              "Successfully created new user in Firebase:",
              userRecord.uid,
              userRecord.displayName
            );
          })
          .catch((error) => {
            console.log("Error creating new user in Firebase:", error);
          });
        res.json({
          message: "User Signed Up",
          status: "Success",
          isIn: true,
        });
      } catch (error) {
        console.error(error);
        res.json({
          message: "Error Saving User",
          status: "Alert",
          isIn: false,
        });
      }
    } else {
      res.json({
        message: "User Not In Any Group!",
        status: "Alert",
        isIn: false,
      });
    }
  }
});

// Update User from Profile Screen
app.post("/api/updateUser", async (req, res) => {
  const {
    fullName,
    address,
    email,
    city,
    phone,
    id,
    passport,
    numDocument,
    foodDrink,
  } = req.body;

  const currentStudent = await Users.findOne({ email });
  if (currentStudent) {
    const query = { email };

    await Users.findOneAndUpdate(query, {
      fullName,
      address,
      city,
      phone,
      isId: id,
      isPassport: passport,
      numDocument,
      tripFoodDrink: foodDrink,
    });

    console.log("User Updated!");
    res.json({ message: "User Updated" });
  } else {
    res.json({ message: "User Not Found!" });
  }
});

// Edit User Password
const saltRounds = 10;
app.post("/api/editPassword", async (req, res) => {
  const { password, email } = req.body;
  console.log(req.body);

  const currentUser = await Users.findOne({ email });
  console.log("current user:", currentUser);

  if (currentUser) {
    const query = {
      email,
    };
    // const hashPassword = await bcrypt.hash(password, saltRounds);

    await Users.findOneAndUpdate(query, {
      password: password,
    });

    res.json({ message: "Password Updated", status: "Success" });
  } else {
    res.json({ message: "User Not Found!", status: "Alert" });
  }
});

// Post Group From Admin
app.post("/api/postGroup", async (req, res) => {
  const {
    name,
    fullName,
    email,
    token,
    city,
    phone,
    numOfPeople,
    startDate,
    endDate,
    programGroup,
    hotel,
  } = req.body;
  // Check if token is provided
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  console.log("GROUP:", req.body);

  const currentSchool = await Schools.findOne({ email: email });
  if (!currentSchool) {
    const convertedStartDate = new Date(startDate);
    const convertedEndDate = new Date(endDate);

    // New Group
    const newSchool = new Schools({
      nameGroup: name,
      fullNameTeacher: fullName,
      email: email,
      tokenGroup: token,
      password: token,
      city: city,
      hotel,
      phone: phone,
      peopleCount: parseInt(numOfPeople),
      startDate: convertedStartDate,
      endDate: convertedEndDate,
      program: programGroup,
    });
    console.log(" NEW GROUP:", newSchool);

    await newSchool.save();

    console.log("TOKEN:", token);

    const studentUser = new Users({
      fullName: fullName,
      email: email,
      password: token,
      phone: phone,
      city: city,
      isId: false,
      isPassport: false,
      tokenGroup: token,
      role: "Teacher",
      program: programGroup,
    });

    await studentUser.save();

    // Register Firebase User
    await admin
      .auth()
      .createUser({
        email,
        password: token,
        displayName: fullName,
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log(
          "Successfully created new user in Firebase:",
          userRecord.uid,
          userRecord.displayName
        );
      })
      .catch((error) => {
        console.log("Error creating new user in Firebase:", error);
      });

    res.json({ message: "New Group & User Posted" });
  } else {
    res.json({ message: "Group already in database" });
  }
});

// Edit Group
app.post("/api/editGroup", async (req, res) => {
  const { idGroup, editGroupForm } = req.body;
  const [
    { value: nameGroup },
    { value: fullNameTeacher },
    { value: email },
    { value: phone },
    { value: city },
    { value: hotel },
    { value: people },
  ] = editGroupForm;

  const peopleCount = parseInt(people);
  try {
    query = {
      _id: idGroup,
    };
    const updatedGRoup = await Schools.findOneAndUpdate(
      query,
      {
        $set: {
          nameGroup,
          fullNameTeacher,
          email,
          phone,
          city,
          hotel,
          peopleCount,
        },
      },
      { new: true }
    );
    console.log("Updated Group:", updatedGRoup);

    res.json({ status: "Success", message: "Succesfully updated group." });
  } catch (error) {
    res.json({ status: "Failed", message: "Error updating group!" });
  }
});

// Delete Group
app.post("/api/deleteGroup", async (req, res) => {
  const { id, email } = req.body;
  let firebaseId;
  await admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.uid}`);
      firebaseId = userRecord.uid;
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });
  console.log("UID:", firebaseId);

  try {
    const deletedGroup = await Schools.deleteOne({ _id: id });
    const deleteUser = await Users.deleteOne({ email });
    console.log("Deleted group:", deletedGroup);
    console.log("Deleted user:", deleteUser);

    admin
      .auth()
      .deleteUser(firebaseId)
      .then(() => {
        console.log("Successfully deleted Firebase user");
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });

    res.json({ message: "Group Deleted Succesfully", status: "Success" });
  } catch (error) {
    res.json({ message: "No Group Found!", status: "Error" });
  }
});

// Edit Service From Admin

app.post("/api/editService", async (req, res) => {
  const {
    id,
    name,
    subtitle,
    description,
    images,
    food,
    drinks,
    activities,
    newActivity,
    newFood,
    newDrinks,
  } = req.body;
  const query = {
    _id: id,
  };
  console.log("New acitivity", name);
  try {
    if (name !== "Food & Drink") {
      if (newActivity !== "") {
        await Services.findOneAndUpdate(
          query,
          {
            $set: {
              name,
              subTitle: subtitle,
              description,
              images,
            },
            $push: { namesActivities: newActivity },
          },
          { new: true }
        );
        res.json({ message: "Service Updated Successfully", status: "Succes" });
      } else if (newActivity === "") {
        await Services.findOneAndUpdate(
          query,
          {
            $set: {
              name,
              subTitle: subtitle,
              description,
              images,
              namesActivities: activities,
            },
          },
          { new: true }
        );
        res.json({
          message: "Service Updated Successfully No Input",
          status: "Succes",
        });
      }
    } else {
      if (newFood !== "" && newDrinks !== "") {
        console.log("Triggered Food");
        await Services.findOneAndUpdate(
          query,
          {
            $set: {
              name,
              subTitle: subtitle,
              description,
              images,
            },
            $push: { foods: newFood, drinks: newDrinks },
          },
          { new: true }
        );
        res.json({
          message: "Food & Drinks Updated Successfully",
          status: "Succes",
        });
      } else if (newDrinks !== "") {
        console.log("Triggered Drink");
        await Services.findOneAndUpdate(
          query,
          {
            $set: {
              name,
              subTitle: subtitle,
              description,
              images,
              foods: food,
            },
            $push: { drinks: newDrinks },
          },
          { new: true }
        );
        res.json({ message: "Drinks Updated Successfully", status: "Succes" });
      } else if (newFood !== "") {
        await Services.findOneAndUpdate(
          query,
          {
            $set: {
              name,
              subTitle: subtitle,
              description,
              images,
              drinks,
            },
            $push: { foods: newFood },
          },
          { new: true }
        );
        res.json({ message: "Food Updated Successfully", status: "Succes" });
      } else {
        console.log("update everything but no food and drinks");
        await Services.findOneAndUpdate(
          query,
          {
            $set: {
              name,
              subTitle: subtitle,
              description,
              images,
              drinks,
              foods: food,
            },
          },
          { new: true }
        );
        res.json({ message: "Updated Successfully", status: "Succes" });
      }
    }
  } catch (error) {
    res.json({ message: "Service Not Found", status: "Error" });
  }
});

// Delete Image From Service
app.post("/api/deleteImage", async (req, res) => {
  const { idService, imageUrl } = req.body;
  try {
    const query = {
      _id: idService,
    };
    await Services.findOneAndUpdate(
      query,
      {
        // Use $pull to remove the imageUrl from the images array
        $pull: { images: imageUrl },
      },
      {
        new: true, // Return the updated document
      }
    );
    res.json({ message: "Image Deleted Succesfully", status: "Success" });
  } catch (error) {
    res.json({ message: "Image Not Found", status: "Error" });
  }
});

// Delete Name Service From Admin
app.post("/api/deleteNameService", async (req, res) => {
  const { idService, newActivity, food, drink } = req.body;
  try {
    const currentService = await Services.findOne({ _id: idService });
    if (
      currentService.namesActivities.length > 0 &&
      newActivity !== undefined
    ) {
      const query = {
        _id: idService,
      };
      await Service.findOneAndUpdate(
        query,
        {
          $pull: { namesActivities: newActivity },
        },
        { new: true }
      );
      res.json({
        message: "Item Activity Deleted Succesfully",
        status: "Succes",
      });
    } else if (currentService.foods.length > 0 && food !== undefined) {
      const query = {
        _id: idService,
      };
      await Service.findOneAndUpdate(
        query,
        {
          $pull: { foods: food },
        },
        { new: true }
      );
      res.json({ message: "Item Food Deleted Succesfully", status: "Succes" });
    } else if (currentService.drinks.length > 0 && drink !== undefined) {
      const query = {
        _id: idService,
      };
      await Service.findOneAndUpdate(
        query,
        {
          $pull: { drinks: drink },
        },
        { new: true }
      );
      res.json({ message: "Item Drink Deleted Succesfully", status: "Succes" });
    }
  } catch (error) {
    res.json({ message: "No Service Found", status: "Error" });
  }
});

// Add Program Day
app.post("/api/addProgramDayDrag", async (req, res) => {
  const { idGroup, tokenGroup, date, data, value } = req.body;
  console.log(req.body);
  try {
    // Update Group Program Admin
    query = {
      _id: idGroup,
    };
    const updatedGRoup = await Schools.findOneAndUpdate(
      query,
      {
        $set: {
          [`program.${date}`]: data,
        },
      },
      { new: true }
    );
    console.log("Added & Ordered Program to Group:", updatedGRoup);

    // Update Users Program
    const currentEvent = await Programs.findOne({ _id: value });

    const updateUsers = await Users.updateMany(
      { tokenGroup },
      {
        $push: {
          [`program.${date}`]: currentEvent,
        },
      }
    );

    console.log("Updated Users program:", updateUsers);

    res.json({
      message: "Program Added & Ordered Succesfully!",
      status: "Success",
    });
  } catch (error) {
    res.json({
      message: "Group not found or adding not possibile!",
      status: "Failed",
    });
  }
});

// Edit Program day
app.post("/api/editProgramDay", async (req, res) => {
  const { idGroup, tokenGroup, date, newProgram, itemId, programToAdd } =
    req.body;
  console.log(req.body);

  try {
    query = {
      _id: idGroup,
    };
    const updatedGRoup = await Schools.findOneAndUpdate(
      query,
      {
        $set: {
          [`program.${date}`]: newProgram,
        },
      },
      { new: true }
    );
    console.log("Updated Group:", updatedGRoup);

    const pullInUsers = await Users.updateMany(
      { tokenGroup },
      {
        $pull: { [`program.${date}`]: { _id: itemId } },
      }
    );

    const pushInUsers = await Users.updateMany(
      { tokenGroup },
      {
        $push: {
          [`program.${date}`]: programToAdd,
        },
      }
    );

    console.log("Updated pulling in users:", pullInUsers);
    console.log("Updated psuhing in users:", pushInUsers);

    res.json({ message: "Program edited Succesfully!", status: "Success" });
  } catch (error) {
    res.json({
      message: "Group not found or edit not possibile!",
      status: "Failed",
    });
  }
});

// Delete Program Day
app.post("/api/deleteProgramDay", async (req, res) => {
  const { idGroup, tokenGroup, date, newProgramGroup, itemId } = req.body;
  console.log(req.body);
  try {
    const fieldPath = `program.${date}`;

    query = {
      _id: idGroup,
    };
    const updatedGRoup = await Schools.findOneAndUpdate(
      query,
      {
        $set: {
          [fieldPath]: newProgramGroup,
        },
      },
      { new: true }
    );
    console.log("Updated Group:", updatedGRoup);

    const updateUsers = await Users.updateMany(
      { tokenGroup },
      {
        $pull: {
          [fieldPath]: { _id: itemId },
        },
      }
    );

    console.log("Updated users:", updateUsers);

    res.json({ message: "Program deleted Succesfully!", status: "Success" });
  } catch (error) {
    res.json({
      message: "Group not found or edit not possibile!",
      status: "Failed",
    });
  }
});

// Move Event from date to date
app.post("/api/moveEvent", async (req, res) => {
  const { itemId, idGroup, tokenGroup, dateValue, date } = req.body;
  try {
    const currentGroup = await Schools.findOne({ _id: idGroup });
    const groupItemToFilter = currentGroup.program[date].find(
      (elem) => elem._id === itemId
    );
    const groupQuery = {
      _id: idGroup,
    };
    const filterGroup = await Schools.findOneAndUpdate(groupQuery, {
      $pull: {
        [`program.${date}`]: { _id: groupItemToFilter._id },
      },
    });
    const addToGroup = await Schools.findOneAndUpdate(groupQuery, {
      $push: {
        [`program.${dateValue}`]: groupItemToFilter,
      },
    });
    const currentUsers = await Users.find(tokenGroup);
    await Promise.all(
      currentUsers.map(async (user) => {
        const itemToFilter = user.program[date].find(
          (elem) => elem._id === itemId
        );
        if (!itemToFilter) return; // Skip if no matching item is found

        const query = {
          _id: user._id,
        };
        const deletedItem = await Users.findOneAndUpdate(query, {
          $pull: { [`program.${date}`]: { _id: itemToFilter._id } },
        });
        const addItemToNewDate = await Users.findOneAndUpdate(query, {
          $push: {
            [`program.${dateValue}`]: itemToFilter,
          },
        });
        console.log(
          `Edited user to delete item: ${deletedItem} - and to add item: ${addItemToNewDate} `
        );
      })
    );

    console.log("Updated Group:", addToGroup);

    res.json({
      status: "Success",
      message: `Succesfully moved event in date ${dateValue}`,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: `Error to moving event in date ${dateValue} - error:${error}`,
    });
  }
});

// Edit Program By User choice in calendar
app.post("/api/postDailyProgramByUser", async (req, res) => {
  const { email, date, value } = req.body;
  console.log("Body:", req.body);
  try {
    query = {
      email,
    };
    const updatedGroup = await Users.findOneAndUpdate(
      query,
      {
        $set: { [`program.${date}`]: value },
      },
      { new: true }
    );

    console.log("Updated Group:", updatedGroup);
    res.json({
      status: "Success!",
      message: "Succesfully Confirm Program Choice",
    });
  } catch (error) {
    res.json({ status: "Failed!", message: "Error Editing Program" });
  }
});

// Add Program Event
app.post("/api/postProgram", async (req, res) => {
  const { getHour, event, isOptional } = req.body;
  try {
    const newEvent = new Programs({
      hour: getHour,
      title: event,
      isOptional,
    });

    await newEvent.save();
    console.log("New event posted:", newEvent);
    res.json({ status: "Success", message: "New event created successfully." });
  } catch (error) {
    res.json({ status: "Error adding Event!" });
  }
});

// Delete Program Event
app.post("/api/deleteEvent", async (req, res) => {
  const { id } = req.body;
  try {
    const deletedEvent = await Programs.deleteOne({ _id: id });
    console.log("Deleted event:", deletedEvent);
    res.json({ status: "Success", message: "Event deleted successfully." });
  } catch (error) {
    res.json({ status: "Failed", message: "No matching event to delete!" });
  }
});

// Post Admin Dinner in Date
app.post("/api/postAdminDinner", async (req, res) => {
  const { idGroup, date, dinnerDeadline } = req.body;
  try {
    query = {
      _id: idGroup,
    };

    const updatedGroup = await Schools.findOneAndUpdate(
      query,
      {
        $set: {
          [`dinner.${date}`]: dinnerDeadline,
        },
      },
      { new: true }
    );
    console.log("Updated Group with dinner:", updatedGroup);
    res.json({
      status: "Success",
      message: "Succesfully posted dinner to group!",
    });
  } catch (error) {
    res.json({ status: "Failed", message: "No group matched to post dinner!" });
  }
});

// Post User Dinner
app.post("/api/postUserDinner", async (req, res) => {
  const { idUser, date, dinnerConfirm } = req.body;
  try {
    query = {
      _id: idUser,
    };
    const updatedUser = await Users.findOneAndUpdate(
      query,
      {
        $set: {
          [`dinner.${date}`]: dinnerConfirm,
        },
      },
      { new: true }
    );

    console.log("Updated user with confirmed dinner:", updatedUser);
    res.json({
      status: "Succes",
      message: "Succesfully added dinner choices to user.",
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: "No user found or error server side!",
    });
  }
});

// Post User Device Push Token
app.post("/api/postToken", async (req, res) => {
  const { token, userEmail } = req.body;
  try {
    const currentUser = await Users.findOne({ email: userEmail });

    if (currentUser) {
      try {
        const query = {
          email: userEmail,
        };
        await Users.findOneAndUpdate(query, { pushToken: token });
        res.json({
          message: `Push Token Added to ${currentUser.fullName}`,
          status: "Success",
        });
      } catch (error) {
        res.json({ message: error, status: "Error" });
      }
    }
  } catch (err) {
    res.json({
      message: err,
      status: "Error",
    });
  }
});

// Sent Notifications
app.post("/api/sendNotifications", async (req, res) => {
  const { message, title, groupToken, isNotification } = req.body;
  const usersFilteredPerGroup = await Users.find({ tokenGroup: groupToken });
  const numOfUSers = usersFilteredPerGroup.filter(
    (item) => item.pushToken !== undefined
  );
  console.log("User for notification", numOfUSers);
  if (usersFilteredPerGroup.length > 0) {
    if (numOfUSers.length > 0) {
      numOfUSers.forEach(async (item) => {
        console.log("Sendig Notification to:", item.email);
        if (item.pushToken) {
          const body = {
            to: item.pushToken, // The device push token
            sound: "default",
            title: title,
            body: message,
            data: { isNotification }, // Custom data
          };

          try {
            const response = await axios.post(
              "https://exp.host/--/api/v2/push/send",
              body,
              {
                headers: {
                  Accept: "application/json",
                  "Accept-Encoding": "gzip, deflate",
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("Notification Response:", response.data);

            const query = {
              email: item.email,
            };
            await Users.findOneAndUpdate(query, { isNotification: true });
          } catch (error) {
            console.error(
              "Error sending notification:",
              error.response ? error.response.data : error.message
            );
          }
        }
      });
      res.json({
        message: `${numOfUSers.length} Push Notifications Sent Succesfully!`,
        status: "Success",
        notification: true,
      });
    }
  } else {
    res.json({
      message:
        "No Users for Notification or Wrong Group Token. Please Check Users/Groups.",
      status: "Error",
      notification: false,
    });
  }
});

// Post User Picks For Trip
app.post("/api/postTripMeal", async (req, res) => {
  const { email, userPicks } = req.body;
  const currentUser = await Users.findOne({ email });
  if (currentUser) {
    try {
      const query = { email };
      await Users.findOneAndUpdate(query, {
        tripFoodDrink: userPicks,
        isNotification: false,
      });
      res.json({ message: "User Meal Succesfully Added", status: "Success" });
    } catch (error) {
      res.json({ message: "User Meal Not Stored!", status: "Error" });
    }
  } else {
    res.json({ message: "User Not Found", status: "Error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
