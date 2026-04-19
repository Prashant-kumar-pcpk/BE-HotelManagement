const express = require("express");

const router = express.Router(); // enable the routing

// import the controller
const {registerUser, login, getHome, getAllUsers} = require("../controller/userController");
const {createContact} = require("../controller/contactController")


//  routes
router.post("/register", registerUser);
router.post("/login", login);
router.get("/all", getAllUsers);
router.get("/home", getHome);

// contact
router.post("/contact", createContact)

module.exports = router;
