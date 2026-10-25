const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const customerRoutes = require("./routes/customerRoutes");
const customerDashboardRoutes = require("./routes/customerDashboardRoutes");
const vendorDashboardRoutes = require("./routes/vendorDashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ==============================
// Create HTTP Server
// ==============================

const server = http.createServer(app);

// ==============================
// Socket.io
// ==============================

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("Client Connected :", socket.id);
    socket.on("disconnect", () => {
        console.log("Client Disconnected :", socket.id);
    });
});

// ==============================
// Middleware
// ==============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==============================
// Static Files
// ==============================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ==============================
// API Routes
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/customer/dashboard", customerDashboardRoutes);
app.use("/api/vendor-dashboard", vendorDashboardRoutes);
app.use("/api/admin", adminRoutes);

// ==============================
// Home
// ==============================

app.get("/", (req, res) => {
    res.send("Medi Track API Running");
});

// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});
