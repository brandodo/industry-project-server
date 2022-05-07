const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4 } = require("uuid");
require("dotenv").config();
const { PORT, BACKEND_URL } = process.env;

//Read File

function readBookings() {
  const userData = fs.readFileSync("./data/booking.json");
  const parsedData = JSON.parse(userData);
  return parsedData;
}

//Write File
function writeBookings(data) {
  fs.writeFileSync("./data/booking.json", JSON.stringify(data));
}

//get list of available bookings

router.route("/").get((req, res) => {
  const bookingList = readBookings();

  res.status(200).send(bookingList);
  console.log("Booking List Sent");
});

//book room for a specific slot , send useremail, roomid,time

router.route("/").post((req, res) => {
  const roomName = req.body.roomname;
  const roomID = req.body.roomid;
  const roomTime = req.body.time;
  const roomSlot = req.body.slot;
  const roomDate = req.body.date;
  const userEmail = req.body.email;

  const roomObject = {
    roomname: roomName,
    roomid: roomID,
    date: roomDate,
  };

  const bookingList = readBookings();
  let tempList = bookingList;

  const listToUpdate = bookingList.filter((room) => {
    return room.roomid === roomID && room.date === roomDate;
  });

  if (listToUpdate.length !== 1) {
    res.status(400).send("Enter valid room information");
  } else {
    const finalList = tempList.forEach((room) => {
      console.log(room.roomSlot);
      if (room.roomSlot === roomSlot && room.date === roomDate) {
        return room.roomSlot.useradded.push(userEmail);
      } else {
        return room;
      }
    });
    res.status(200).send(finalList);
    console.log("booking completed successfully");
    console.log(finalList);
  }
});

module.exports = router;
