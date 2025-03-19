//ledUqqPpVIakX7AA - Password
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

require("dotenv").config();

const presentationRoutes = require("./Route/presentationSchedule.route");
const examinerRoutes = require("./Route/examiner.route");
const moduleRoutes = require("./Route/model.route");
const groupRoutes = require("./Route/group.route")

const app = express();
app.use(cors());
app.use(express.json());

//Presentation routes
app.use("/api/presentations", presentationRoutes);
app.use("/api/examiners", examinerRoutes);


app.use("/api/modules", moduleRoutes);
app.use("/api/groups", groupRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
})
.catch((err) => console.log("MongoDB Connection Error ❌:", err));
