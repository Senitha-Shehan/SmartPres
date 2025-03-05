//ledUqqPpVIakX7AA - Password

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

require("dotenv").config();

const presentationRoutes = require("./Route/presentationSchedule.route");
const examinerRoutes = require("./Route/examiner.route");

const app = express();
const cors = require("cors");
app.use(cors());

//middleware
app.use(express.json());

//Presentation routes
app.use("/api/presentations", presentationRoutes);
app.use("/api/examiners", examinerRoutes);

app.use("/", (req,res,next) => {
    res.send("It's Working");
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
})
.catch((err) => console.log("MongoDB Connection Error ❌:", err));
