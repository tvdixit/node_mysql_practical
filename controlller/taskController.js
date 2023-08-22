const Connection = require("../config/db");
const Task = require("../Schema/taskSchema");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const createTask = (req, res) => {
  const task = {
    ...req.body,
    image: req.file.filename,
  };
  console.log(req.file);
  // console.log(req.body, "task");
  Task.createTask(task, (err, result) => {
    if (err) {
      res.status(400).json({
        message: "Error creating task",
        error: err.message,
      });
    } else {
      res.status(201).json({
        message: "Task created successfully",
        result: result,
      });
    }
  });
};
//

const getTask = (req, res) => {
  const sql = "SELECT * FROM task";
  Connection.query(sql, (err, results) => {
    if (err) {
      res.status(400).json({
        message: "Error creating user",
        error: err.message,
      });
    } else {
      res.status(201).json({
        message: "User created successfully",
        result: results,
      });
    }
  });
};
//
const UpdateTask = (req, res) => {
  const user_id = req.user.user_id;
  console.log(user_id);
  const sql =
    "UPDATE task SET name = ?, description = ?, priority = ?, is_completed = ?, is_deleted = ? WHERE user_id = ?";

  const values = [
    req.body.name,
    req.body.description,
    req.body.priority,
    req.body.is_completed,
    req.body.is_deleted,
    user_id,
  ];

  Connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        message: "Error updating task",
        error: err.message,
      });
    } else if (result.affectedRows === 0) {
      res.status(403).json({
        message: "You are not authorized to update this task.",
      });
    } else {
      res.status(200).json({
        message: "Task updated successfully",
        result: result,
      });
    }
  });
};

const getTasksByPriorityPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let priority = req.query.priority;
  const search = req.query.search || "";
  let is_completed = req.query.is_completed;
  let is_deleted = req.query.is_deleted;

  try {
    const allowedPriorities = ["high", "medium", "low"];
    priority = allowedPriorities.includes(priority) ? priority : "all";

    const allowedOptions = ["0", "1"];
    is_completed = allowedOptions.includes(is_completed) ? is_completed : "all";
    is_deleted = allowedOptions.includes(is_deleted) ? is_deleted : "all";

    let sql = `
      SELECT * FROM task WHERE 
      ${priority !== "all" ? `priority = '${priority}'` : "1"}
      AND
      (is_completed = '${is_completed}' OR '${is_completed}' = 'all')
      AND
      (is_deleted = '${is_deleted}' OR '${is_deleted}' = 'all')
    `;
    const tasks = await new Promise((resolve, reject) => {
      Connection.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    res.json({
      tasks: tasks.slice((page - 1) * limit, page * limit),
      page: page,
      limit: limit,
      search: search,
      priority: priority,
      is_completed: is_completed,
      is_deleted: is_deleted,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

module.exports = {
  createTask,
  upload,
  getTask,
  UpdateTask,
  getTasksByPriorityPagination,
};
