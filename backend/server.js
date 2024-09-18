const express = require("express");
const app = express();
const cors = require("cors");
const Users = require("./models/Users");
const Schools = require("./models/Schools");
const Services = require("./models/Services");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Service = require("./models/Services");

require("dotenv").config({ path: "../.env" });

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
    origin: `http://localhost:8081`,
    // origin: "http://localhost:5173",
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
      message: "User Not In Any Group!",
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
        });
        await newUser.save();
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
  const { fullName, address, email, city, phone, id, passport, numDocument } =
    req.body;

  const currentStudent = await Users.findOne({ email });
  if (currentStudent) {
    const query = { email };

    await Users.findOneAndUpdate(query, {
      address,
      city,
      phone,
      isId: id,
      isPassport: passport,
      numDocument,
    });

    console.log("User Updated:");
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
  const { name, fullName, email, token, city, phone } = req.body;
  // Check if token is provided
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  console.log("GROUP:", req.body);

  const currentSchool = await Schools.findOne({ email: email });
  if (!currentSchool) {
    // New Group
    const newSchool = new Schools({
      nameGroup: name,
      fullNameTeacher: fullName,
      email: email,
      tokenGroup: token,
      password: token,
      city: city,
      phone: phone,
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
    });

    await studentUser.save();

    res.json({ message: "New Group & User Posted" });
  } else {
    res.json({ message: "Group already in database" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
