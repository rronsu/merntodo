import { connectToDB } from "../utils/connect.js";
import Todo from "../models/todoModel.js";
import { createError } from "../utils/error.js";

export async function getAllTodos(req, res, next) {
  console.log(req.user);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await connectToDB();
  const todos = await Todo.find({ userID: req.user.id });
  res.status(200).json(todos);
}
export async function getTodo(req, res, next) {
  await connectToDB();
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo.userID.toString() !== req.user.id)
      return next(createError(404, "Not authorized"));
    res.status(200).json(todo);
  } catch (error) {
    return next(createError(404, "Todo not found"));
  }
}
export async function updateTodo(req, res, next) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const id = req.params.id;
  console.log(req.body);
  if (!req.body) return next(createError(404, "missing required fields"));
  try {
    await connectToDB();
    const todo = await Todo.findById(id);
    if (todo.userID.toString() !== req.user.id)
      return next(createError(404, "Not authorized"));
    todo.title = req.body.title || todo.title;
    if (req.body.isCompleted !== undefined) {
      todo.isCompleted = req.body.isCompleted;
    }
    await todo.save();
    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    return next(createError(404, "Todo not found"));
  }
}
export async function deleteTodo(req, res, next) {
  console.log(req.params.id);
  try {
    await connectToDB();
    const todo = await Todo.deleteOne({
      _id: req.params.id,
      userID: req.user.id,
    });
    if (!todo.deletedCount) throw new Error("Todo not found");
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    return next(createError(404, "Todo not found"));
  }
}
export async function addTodo(req, res, next) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(req.user);
  if (!req.body || !req.body.title)
    return next(createError(400, "Todo title is required"));
  await connectToDB();
  const newTodo = new Todo({ title: req.body.title, userID: req.user.id });
  await newTodo.save();
  res.status(201).json(newTodo);
}

export async function check(req, res, next) {
  try {
    await connectToDB();
    const check = await Todo.find({ 
      userID: req.user.id,
      isCompleted: true 
    });
    res.status(200).json(check);
  } catch (error) {
    return next(createError(404, "Could not fetch completed todos"));
  }
}
