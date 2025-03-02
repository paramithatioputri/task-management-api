const { validationResult } = require("express-validator");
const Task = require("../models/task");

exports.getTasks = async (req, res, next) => {
  const status = req.query.status;
  const sortBy = req.query.sortBy || 'asc';

  try {
    let tasks;

    if (status) {
      tasks = await Task.find({ status: status }).sort({dueDate: sortBy});
    } else {
      tasks = await Task.find().sort({dueDate: sortBy});
    }

    if (!tasks) {
      const error = new Error("No tasks found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ status: "SUCCESS", tasks: tasks });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error("The task not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ status: "SUCCESS", task: task });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const status = req.body.status;

  const date = new Date();
  const tempDueDate = date.setDate(date.getDate() + 2);
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 400;
      throw error;
    }
    const task = new Task({
      title: title,
      description: description,
      status: status,
      dueDate: new Date(tempDueDate),
    });

    await task.save();

    res.status(201).json({ status: "SUCCESS", message: "New task created!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  const taskId = req.params.taskId;

  const title = req.body.title;
  const description = req.body.description;
  const status = req.body.status;
  const dueDate = req.body.dueDate;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.findById(taskId);
    task.title = title;
    task.description = description;
    task.status = status;
    task.dueDate = dueDate;
    await task.save();

    res
      .status(200)
      .json({ status: "SUCCESS", message: "Task has been updated!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  const taskId = req.params.taskId;

  try {
    await Task.findByIdAndDelete(taskId);

    res
      .status(204)
      .json({ status: "SUCCESS", message: "Task has been deleted!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};