const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4 } = require("uuid");
require("dotenv").config();
const moment = require("moment");

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
  let user;

  const finalList = userlist.filter((userinfos) => {
    if (userinfos.userid === userEmail && userinfos.username === username) {
      updateFlag = true;

      user = userinfos;
      userInfoUpdated = user.userInfo;
      userInfoUpdated[0].qrcodecolor = qrcode;
      userInfoUpdated[0].date = moment().format("YYYY-MMM-DD");
      return { userinfos, userInfo: userInfoUpdated };
    } else {
      return userinfos;
    }
  });

  if (updateFlag) {
    res.status(200).send(user);
    writeUsers(finalList);
    console.log("qr code updated");
  } else {
    res.status(400).send("No valid entry found");
    console.log("qr code update request failed");
  }
});

module.exports = router;
