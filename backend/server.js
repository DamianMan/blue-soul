const express = require("express");
const app = express();
const cors = require("cors");
const Students = require("./models/Students");
const Schools = require("./models/Schools");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

app.get("/api/getStudents", async (req, res) => {
  try {
    const allStudents = await Students.find();
    res.json(allStudents);
  } catch (error) {
    res.json(error);
  }
});

// Sing Up User
app.post("/api/signUpUser", async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);
  const isInGroup = await Schools.findOne({ tokenGroup: password });
  console.log(isInGroup);

  if (isInGroup) {
    try {
      const newUser = new Students({
        fullName: fullName,
        email: email,
        password: password,
        tokenGroup: password,
      });
      await newUser.save();
      res.json({
        message: "User Signed Up and Logged In",
        status: "Success",
        isIn: true,
      });
    } catch (error) {
      console.error(error);
      res.json({ message: "Error Saving User", status: "Alert", isIn: false });
    }
  } else {
    res.json({
      message: "User Not In Any Group!",
      status: "Alert",
      isIn: false,
    });
  }
});

// Post User in DB
app.post("/api/postUser", async (req, res) => {
  const { fullName, address, email, city, phone, id, passport, numDocument } =
    req.body;

  const currentStudent = await Students.findOne({ email });
  if (currentStudent) {
    const query = { email };

    await Students.findOneAndUpdate(query, {
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

  const currentUser = await Students.findOne({ email });
  console.log("current user:", currentUser);

  if (currentUser) {
    const query = {
      email,
    };
    // const hashPassword = await bcrypt.hash(password, saltRounds);

    await Students.findOneAndUpdate(query, {
      password: password,
    });

    res.json({ message: "Password Updated", status: "Success" });
  } else {
    res.json({ message: "User Not Found!", status: "Alert" });
  }
});

// Post Group
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

    const studentUser = new Students({
      fullName: fullName,
      email: email,
      password: token,
      phone: phone,
      city: city,
      isId: false,
      isPassport: false,
      tokenGroup: token,
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
