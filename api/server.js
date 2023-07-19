const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: "https://todo-list-mern-client.vercel.app"
}));


// connect to database
mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log("Connected to DB");}).catch((err) => console.log("error", err))

// get all items
const Todo = require("./models/Todo")
app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
})

// create new items
app.post("/todo/new", (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save();
    res.json(todo);
})

// delete an item by id
app.delete("/todo/delete/:id", async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);
    
    res.json(result);
})

// update item turn to complete
app.put("/todo/complete/:id", async (req, res) => {
    const item = await Todo.findById(req.params.id);
    item.complete = !item.complete;
    item.save();
    res.json(item);
})

// start
app.listen(process.env.PORT, () => console.log("Server started on port", process.env.PORT))

