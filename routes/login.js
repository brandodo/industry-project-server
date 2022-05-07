const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4 } = require("uuid");
require("dotenv").config();
const { PORT, BACKEND_URL } = process.env;

//Read File

function readUsers() {
  const userData = fs.readFileSync("./data/userlist.json");
  const parsedData = JSON.parse(userData);
  return parsedData;
}

//Write File
function writeUsers(data) {
  fs.writeFileSync("./data/userlist.json", JSON.stringify(data));
}

//Validate and get userlist
router.route("/").post((req, res) => {
  const userlist = readUsers();
  const userListUpdated = userlist.find((user) => {
    return (
      req.body.userid === user.userid && req.body.password === user.password
    );
  });

  userListUpdated
    ? (res.status(200).send(userListUpdated),
      console.log("Credentials Correct"))
    : (res.status(400).send("User ID / Password Invalid"),
      console.log("Credentials Invalid"));
});

module.exports = router;
