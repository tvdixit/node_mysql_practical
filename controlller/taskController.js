const Connection = require("../config/db");
const i18n = require("i18n");
const Task = require("../Schema/taskSchema");
const { taskQuery } = require("../services/taskPaginationQuery");

const createTask = (req, res) => {
  const task = {
    ...req.body,
    image: req.file.filename,
  };
  Task.createTask(task, (err, result) => {
    if (err) {
      const errorMessage = req.__("Error creating task");
      res.status(400).json({ message: errorMessage, error: err.message });
    } else {
      const successMessage = req.__("Task created successfully");
      res.status(201).json({ message: successMessage, result: result });
    }
  });
};
//Get ALL Task
// const getTask = (req, res) => {
//   const sql = "SELECT * FROM task";
//   Connection.query(sql, (err, results) => {
//     if (err) {
//       const errorMessage = req.__("Error creating user");
//       res.status(400).json({ message: errorMessage, error: err.message });
//     } else {
//       const successMessage = req.__("Tasks Recieved successfully");
//       res.status(201).json({ message: successMessage, result: results });
//       console.log(successMessage);
//     }
//     console.log();
//   });
// };

const getTask = (req, res) => {
  const lang = req.query.lang;

  if (lang === "fr") {
    req.setLocale("fr");
  } else {
    req.setLocale("en");
  }
  const sql = "SELECT * FROM task";
  Connection.query(sql, (err, results) => {
    if (err) {
      const errorMessage = req.__("Error creating user");
      res.status(400).json({ message: errorMessage, error: err.message });
    } else {
      const successMessage = req.__("Tasks Recieved successfully");
      res.status(201).json({ message: successMessage, result: results });
      console.log(successMessage);
    }
  });
};
//
const gettaskByJoin = (req, res) => {
  const lang = req.query.lang;

  if (lang === "fr") {
    req.setLocale("fr");
  } else {
    req.setLocale("en");
  }
  const sql =
    "SELECT user.first_name, user.email, task.name, task.description, task.due_date, task.priority, task.is_completed FROM user INNER JOIN task ON task.user_id = user.id ORDER BY task.priority";
  Connection.query(sql, (err, results) => {
    if (err) {
      const errorMessage = req.__("Error creating user");
      res.status(400).json({ message: errorMessage, error: err.message });
    } else {
      const successMessage = req.__("Tasks Recieved successfully");
      res.status(201).json({ message: successMessage, result: results });
      console.log(successMessage);
    }
  });
};

//Update Task by userToken :
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
      res
        .status(500)
        .json({ message: "Error updating task", error: err.message });
    } else if (result.affectedRows === 0) {
      res
        .status(403)
        .json({ message: "You are not authorized to update this task." });
    } else {
      res
        .status(200)
        .json({ message: "Task updated successfully", result: result });
    }
  });
};
// Task Pagination :
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

    let sql = await taskQuery(
      priority,
      is_completed,
      is_deleted,
      req.user.user_id
    );
    const tasks = await new Promise((resolve, reject) => {
      Connection.query(sql, [req.user.user_id], (err, result) => {
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
      user_id: req.user.user_id,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

module.exports = {
  createTask,
  getTask,
  gettaskByJoin,
  UpdateTask,
  getTasksByPriorityPagination,
};
