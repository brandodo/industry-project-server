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

//Read File

function readUsers() {
  const userData = fs.readFileSync("./data/userlist.json");
  const parsedData = JSON.parse(userData);
  return parsedData;
}

//read events

function readEvents() {
  const userData = fs.readFileSync("./data/event.json");
  const parsedData = JSON.parse(userData);
  return parsedData;
}

//Write File
function writeUsers(data) {
  fs.writeFileSync("./data/userlist.json", JSON.stringify(data));
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
  const roomDate = req.body.date;
  const userEmail = req.body.email;

  const roomObject = {
    roomname: roomName,
    roomid: roomID,
    date: roomDate,
  };

  const newRoomEntry = {
    roomname: roomName,
    roomid: roomID,
    date: roomDate,
    booking: [],
  };

  const bookingList = readBookings();
  let tempList = bookingList;

  let listToUpdate = bookingList.filter((room) => {
    return room.roomid === roomID && room.date === roomDate;
  });

  if (listToUpdate.length !== 1) {
    let updatedRoomObject = newRoomEntry;
    updatedRoomObject.booking.push({
      timeperiod: roomTime,
      useradded: [userEmail],
    });

    tempList.unshift(updatedRoomObject);
    res.status(200).send(tempList);
    writeBookings(tempList);
  } else {
    let updatedbooking = listToUpdate[0].booking;

    const updatedFinalList = updatedbooking.filter((time) => {
      if (time.timeperiod === roomTime) {
        let updatedUserAddedList = time.useradded;
        updatedUserAddedList.unshift(userEmail);
        updatedUserAddedList = {
          timeperiod: time.timeperiod,
          useradded: updatedUserAddedList,
        };

        return updatedUserAddedList;
      } else {
        return time;
      }
    });

    const finalList = tempList.filter((room) => {
      if (room.roomid === roomID && room.date === roomDate) {
        return { ...bookingList, booking: updatedFinalList };
      } else {
        return room;
      }
    });

    writeBookings(finalList);

    res.status(200).send(finalList);

    console.log("booking completed successfully");
  }
});

//event details get call
router.route("/event").get((req, res) => {
  const eventList = readEvents();

  res.status(200).send(eventList);
  console.log("event list sent");
});
//event details post user call

router.route("/event").post((req, res) => {
  const userList = readUsers();
  const userEmail = req.body.email;
  const eventName = req.body.eventname;
  let updateFlag = false;

  let selectedUserList = userList.filter((user) => {
    if (user.email === userEmail) {
      let updatedEvent = user;

      updatedEvent.event.push(eventName);
      updateFlag = true;
      return updatedEvent;
    } else {
      return user;
    }
  });

  if (updateFlag) {
    res.status(200).send(selectedUserList);
    writeUsers(selectedUserList);
    console.log("posted event details to userlist info");
  } else {
    res.status(400).send("Enter valid information - no match found");

    console.log("posted event details to userlist call failed");
  }
});

module.exports = router;
