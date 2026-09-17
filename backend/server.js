
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");

const protect = require("./middleware/authMiddleware");
const { setIO } = require("./utils/socket");

const app = express();



// -----------------------------
// HTTP SERVER
// -----------------------------
const server = http.createServer(app);

// -----------------------------
// SOCKET.IO
// -----------------------------
const io = new Server(server, {
  cors: {
    origin: "https://restaurant-management-system-eta-ochre.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },

  transports: ["polling", "websocket"],
});

setIO(io);

// -----------------------------
// CORS
// -----------------------------
app.use(
  cors({
    origin: "https://restaurant-management-system-eta-ochre.vercel.app/",
    credentials: true,
  })
);

// -----------------------------
// BODY PARSER
// -----------------------------
app.use(express.json());

// -----------------------------
// DATABASE
// -----------------------------
connectDB();

// -----------------------------
// ROUTES
// -----------------------------
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/menu", menuRoutes);

app.use("/api/orders", protect, orderRoutes);

app.use("/api/feedback", feedbackRoutes);

app.use("/api/admin", adminRoutes);

// -----------------------------
// TEST ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.send("Restaurant Management API is running");
});

// -----------------------------
// SOCKET CONNECTION
// -----------------------------
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinOrderRoom", (orderId) => {
    socket.join(`order_${orderId}`);

    console.log(
      `Socket ${socket.id} joined order_${orderId}`
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(
      "Socket disconnected:",
      socket.id,
      "Reason:",
      reason
    );
  });
});



// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Socket.IO is ready");
});