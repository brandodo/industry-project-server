const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const cors = require("cors");

require("dotenv").config();
const { PORT } = process.env;

//require routes
const login = require("./routes/login");
const booking = require("./routes/booking");

app.use(cors());
app.use(express.json());

app.use("/static/img1", express.static("public/Rectangle 3.jpg"));
app.use("/static/img2", express.static("public/Rectangle 18.jpg"));
app.use("/static/img3", express.static("public/Rectangle 500.jpg"));
app.use("/static/img4", express.static("public/Rectangle 501.jpg"));
app.use("/static/img5", express.static("public/Rectangle 502.jpg"));
app.use("/static/img6", express.static("public/Rectangle 503.jpg"));
app.use("/static/img7", express.static("public/unsplash_t1NEMSm1rgI-1.jpg"));
app.use("/static/img8", express.static("public/unsplash_t1NEMSm1rgI.jpg"));
app.use("/login", login);
app.use("/booking", booking);

// Start the server listening
// It's convention to have this at the end of the file
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
