const Connection = require("../config/db");
const Task = require("../Schema/taskSchema");
const multer = require("multer");
const mysql = require("mysql2");
const fs = require("fs");
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
  console.log(req.body, "cratetask");
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

const gettask = (req, res) => {
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

///

// const getTasksByPriorityPagination = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   let priority = req.query.priority;
//   const search = req.query.search || "";
//   let is_completed = req.query.is_completed;
//   let is_deleted = req.query.is_deleted;

//   try {
//     const allowedPriorities = ["high", "medium", "low"];
//     if (!allowedPriorities.includes(priority)) {
//       priority = "all";
//     }
//     const allowedOptions = ["0", "1"];
//     if (!allowedOptions.includes(is_completed)) {
//       is_completed = "all";
//     }
//     if (!allowedOptions.includes(is_deleted)) {
//       is_deleted = "all";
//     }

//     let sql = `
//       SELECT *
//       FROM task
//       WHERE 1 = 1
//         ${priority !== "all" ? `AND priority = '${priority}'` : ""}
//         ${
//           is_completed === "0"
//             ? " AND is_completed = 0"
//             : is_completed === "1"
//             ? " AND is_completed = 1"
//             : ""
//         }
//         ${
//           is_deleted === "0"
//             ? " AND is_deleted = 0"
//             : is_deleted === "1"
//             ? " AND is_deleted = 1"
//             : ""
//         }
//         ${search ? `AND name LIKE '%${search}%'` : ""}
//       ORDER BY
//         CASE
//           WHEN priority = 'high' THEN 1
//           WHEN priority = 'medium' THEN 2
//           WHEN priority = 'low' THEN 3
//           ELSE 4
//         END
//       LIMIT ${limit} OFFSET ${(page - 1) * limit}
//     `;
//     console.log(sql, "sql");
//     const tasks = await new Promise((resolve, reject) => {
//       Connection.query(sql, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     res.json({
//       tasks: tasks,
//       page: page,
//       limit: limit,
//       search: search,
//       priority: priority,
//       is_completed: is_completed,
//       is_deleted: is_deleted,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch tasks" });
//   }
// };

//
const getTasksByPriorityPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let priority = req.query.priority;
  const search = req.query.search || "";
  let is_completed = req.query.is_completed;
  let is_deleted = req.query.is_deleted;

  try {
    const allowedPriorities = ["high", "medium", "low"];
    if (!allowedPriorities.includes(priority)) {
      priority = "all";
    }
    const allowedOptions = ["0", "1"];
    if (!allowedOptions.includes(is_completed)) {
      is_completed = "all";
    }
    if (!allowedOptions.includes(is_deleted)) {
      is_deleted = "all";
    }

    let sql = `
      SELECT *
      FROM task
      WHERE 1 = 1
        ${priority !== "all" ? `AND priority = '${priority}'` : ""}
        ${
          is_completed === "0"
            ? " AND is_completed = 0"
            : is_completed === "1"
            ? " AND is_completed = 1"
            : ""
        }
        ${
          is_deleted === "0"
            ? " AND is_deleted = 0"
            : is_deleted === "1"
            ? " AND is_deleted = 1"
            : ""
        }
        ${search ? `AND name LIKE '%${search}%'` : ""}
      ORDER BY
        CASE
          WHEN priority = 'high' THEN 1
          WHEN priority = 'medium' THEN 2
          WHEN priority = 'low' THEN 3
          ELSE 4
        END
      LIMIT ${limit} OFFSET ${(page - 1) * limit}
    `;
    console.log(sql, "sql");
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
      tasks: tasks,
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
  gettask,
  getTasksByPriorityPagination,
};
