const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.routes");
const enquiryRoutes = require("./routes/enquiry.routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const app = express(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({success: true,  message: "Fastor7 CRM Backend API is running!" });
});

app.use("/api/auth", authRouter);
app.use("/api/enquiries", enquiryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;