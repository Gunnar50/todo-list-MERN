const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// connect to database
mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log("Connected to DB");}).catch((err) => console.log("error", err))

const Todo = require("./models/Todo")
app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
})

// start
app.listen(process.env.PORT, () => console.log("Server started on port", process.env.PORT))

