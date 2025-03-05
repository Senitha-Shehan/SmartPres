//ledUqqPpVIakX7AA - Password
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

require("dotenv").config();

<<<<<<< Updated upstream
const presentationRoutes = require("./Route/presentationSchedule.route");
const examinerRoutes = require("./Route/examiner.route");
=======
const moduleRoutes = require("./Route/modelRoutes");
const groupRoutes = require("./Route/groupRoutes");
>>>>>>> Stashed changes

const app = express();
const cors = require("cors");
app.use(cors());

//middleware
app.use(express.json());

<<<<<<< Updated upstream
//Presentation routes
app.use("/api/presentations", presentationRoutes);
app.use("/api/examiners", examinerRoutes);
=======


app.use("/api", moduleRoutes);
app.use("/api", groupRoutes);
>>>>>>> Stashed changes


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
})
.catch((err) => console.log("MongoDB Connection Error ❌:", err));
