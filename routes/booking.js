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
  const bookingList = readBookings();
  const users = readUsers();

  let tempList = bookingList;
  let updatedListExisting = null;
  let userBookingInfo = null;

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

  const bookingObject = [
    {
      timeperiod: "8AM to 10AM",
      useradded: [],
    },
    {
      timeperiod: "10AM to 12PM",
      useradded: [],
    },
    {
      timeperiod: "12PM to 2PM",
      useradded: [],
    },
    {
      timeperiod: "2PM to 4PM",
      useradded: [],
    },
    {
      timeperiod: "4PM to 6PM",
      useradded: [],
    },
    {
      timeperiod: "6PM to 8PM",
      useradded: [],
    },
  ];

  const userInfoSent = users.filter((user) => {
    return user.email === userEmail;
  });

  let listToUpdate = bookingList.filter((room) => {
    return room.roomid === roomID && room.date === roomDate;
  });

  if (listToUpdate.length !== 1) {
    let updatedRoomObject = newRoomEntry;
    updatedRoomObject.booking.push({
      timeperiod: roomTime,
      useradded: [userEmail],
    });

    bookingObject.forEach((booking) => {
      if (booking.timeperiod === roomTime) {
      } else {
        updatedRoomObject.booking.push(booking);
      }
    });

    tempList.unshift(updatedRoomObject);
    userBookingInfo = updatedRoomObject;
    res.status(200).send(updatedRoomObject);
    writeBookings(tempList);
    const updatedUserListWrite = users.filter((user) => {
      if (user.email === userEmail) {
        let bookingPush = user.booking;
        bookingPush.unshift(userBookingInfo);

        return { user, booking: bookingPush };
      } else {
        return user;
      }
    });
    writeUsers(updatedUserListWrite);
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
        //updatedListExisting = { ...bookingList, booking: updatedFinalList };
        updatedListExisting = { ...room, booking: updatedFinalList };
        return { ...room, booking: updatedFinalList };
      } else {
        return room;
      }
    });

    writeBookings(finalList);

    res.status(200).send(updatedListExisting);
    userBookingInfo = updatedListExisting;
    const updatedUserListWrite = users.filter((user) => {
      if (user.email === userEmail) {
        let bookingPush = user.booking;
        bookingPush.unshift(userBookingInfo);

        return { user, booking: bookingPush };
      } else {
        return user;
      }
    });
    writeUsers(updatedUserListWrite);

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
  const events = readEvents();
  const userEmail = req.body.email;
  const eventName = req.body.eventname;
  let updateFlag = false;
  let updatedValueReturn = null;

  const selectedEvent = events.filter((event) => {
    return event.eventinfo.name === eventName;
  });

  let selectedUserList = userList.filter((user) => {
    if (user.email === userEmail) {
      let updatedEvent = user;

      updatedEvent.event.push(selectedEvent[0].eventinfo);
      updatedValueReturn = updatedEvent;
      updateFlag = true;
      return updatedEvent;
    } else {
      return user;
    }
  });

  if (updateFlag) {
    res.status(200).send(updatedValueReturn);
    writeUsers(selectedUserList);
    console.log("posted event details to userlist info");
  } else {
    res.status(400).send("Enter valid information - no match found");

    console.log("posted event details to userlist call failed");
  }
});

module.exports = router;
