import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "must provide a user ID"],
    },
    title: {
        type: String,
        required: [true, "must provide a title"],
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;