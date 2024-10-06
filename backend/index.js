const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const User = require("./models/userModel");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, "public")));


// Create HTTP server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("setup", async (userData) => {
    socket.user = userData;
    socket.join(userData._id);
    console.log(`User connected: ${socket.user.name}`);

    try {
      await User.findOneAndUpdate(
        { _id: socket.user._id },
        { status: "online" },
        { new: true }
      );
      socket.emit("connected");
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  });

  socket.on("join chat", (chat) => {
    socket.join(chat);
    console.log("User joined chat:", chat);
  });

  socket.on("new message", async (newMessageRecieved) => {
    console.log(newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id.toString() === newMessageRecieved.sender._id.toString()) {
        return;
      }
      socket.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", async () => {
    if (!socket.user) return;
    try {
      console.log(`Client disconnected: ${socket.user._id}`);
      await User.findOneAndUpdate(
        { _id: socket.user._id },
        { lastSeen: new Date(), status: "offline" },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating last seen:", error);
    }
  });
});
