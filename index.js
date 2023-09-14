const express = require("express");
require("dotenv").config(); //added so we can access .env variables
const bcrypt = require("bcryptjs");
const axios = require('axios'); 
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mongoConnect = require("./db");
const userModel = require("./models/Users");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const users = [{ email: "asdf@ds.com", password: 3234234 }]; //u have to link with mongoose
var users;

userModel.find().then((data) => {
  users = data;
  console.log(users);
}).catch((error) => {
  console.error('Error fetching users:', error);
});


// var add = new userModel({ email: "asdf@ds.com", password: 'sdf' });
// add.save().then(()=>console.log("saved Successsfully")); //then is not necessary to add

//middleware
const verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //get from .env JWT_SECRET
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};

//all the routes

app.post("/api/register", async (req, res) => {
  const user = req.body;
  console.log(user);
  if (!user.email || !user.password) {
    return res.status(400).send("Username and password are required.");
  }
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  // users.push(user); earlier i was using array for test now backedn connected
 var userCreated =  new userModel({ email: user.email, password: user.password }).save();
  res.json(user);
});

app.post("/api/login", async (req, res) => {
  const user = req.body;
  //check if user exists
  const foundUser = await userModel.findOne({ email: req.body.email });

  if (!foundUser) {
    return res.status(400).send("Invalid email or password");
  }

  // Check if the password is correct using bcrypt
  const isPasswordValid = await bcrypt.compare(req.body.password, foundUser.password);
  if (!isPasswordValid) {
    return res.status(400).send("Invalid email or password");
  }
  //create token
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/api/users",verifyUserToken, (req, res) => {
  var getUsers;
  userModel.find().then((data) => {
    getUsers = data;
  res.json(getUsers);

  }).catch((error) => {
    console.error('Error fetching users:', error);
  });
});

//---otp send code 
app.get('/send-otp/:phone/:otp', async (req, res) => {
  const api_url = 'https://uat.onehealthassist.com/otp';
  const { phone, otp } = req.params;
  const data = {
    phone: phone,
    otp: otp
  };

  try {
    const response = await axios.post(api_url, data );
    console.log('SMS sent successfully:', response.data);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});


//file upload code 
const storage = multer.diskStorage({
  destination: (req, file, cb) => { //here req=request,file=file and cb=callback function 
    cb(null, 'uploads/'); // in this first param is null ,if we want to specify there is no  error,else it will show error ,and the second param is to store the file in which folder  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // first param=same to specify no error , 2nd param=Generate unique file names
  }
});

// var upload = multer({storage : storage}).single('image'); u can do this or else below
 var upload = multer({storage : storage});
app.post('/upload-ProfilePic',upload.single('file'),(req,res)=>{
  console.log(req.file);
  res.json({ message: 'File uploaded successfully' });
})




//listening and activated server
app.listen(3000, () => {
  console.log("server is listening on port 3000");
});

