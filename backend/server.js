const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - allows the server to understand JSON and handle CORS
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected..."))
    .catch(err => console.log("❌ DB Connection Error:", err));

// A simple test route to see if it works
app.get('/', (req, res) => {
    res.send("Automata API is running smoothly!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));