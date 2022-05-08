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
    return req.body.email === user.email && req.body.password === user.password;
  });

  userListUpdated
    ? (res.status(200).send(userListUpdated),
      console.log("Credentials Correct"))
    : (res.status(400).send("User Email / Password Invalid"),
      console.log("Credentials Invalid"));
});

//Update qrcode color put request send qr code value along with email and username

router.route("/qrcode").put((req, res) => {
  const userEmail = req.body.email;
  const qrcode = req.body.qrcode;
  const username = req.body.username;
  let updateFlag = false;

  const userlist = readUsers();
  let userInfoUpdated = null;

  const finalList = userlist.filter((userinfos) => {
    if (userinfos.email === userEmail && userinfos.username === username) {
      updateFlag = true;

      userInfoUpdated = userinfos.userInfo;
      userInfoUpdated[0].qrcodecolor = qrcode;
      return { userinfos, userInfo: userInfoUpdated };
    } else {
      return userinfos;
    }
  });
  if (updateFlag) {
    res.status(200).send(userInfoUpdated);
    writeUsers(finalList);
    console.log("qr code updated");
  } else {
    res.status(400).send("No valid entry found");
    console.log("qr code update request failed");
  }
});

module.exports = router;
