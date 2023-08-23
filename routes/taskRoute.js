const express = require("express");
const {
  createTask,
  getTask,
  UpdateTask,
  getTasksByPriorityPagination,
} = require("../controlller/taskController");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { upload } = require("../services/uploadFile");

router
  .post("/createtask", upload.single("image"), createTask)
  .get("/gettask", getTask)
  .get("/gettask/priority", auth(), getTasksByPriorityPagination)
  .patch("/updatetask", auth(), UpdateTask);

module.exports = { route: router };
