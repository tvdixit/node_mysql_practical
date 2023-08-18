const express = require("express");
const taskController = require("../controlller/taskController");
const router = express.Router();

router.post(
  "/createtask",
  taskController.upload.single("image"),
  taskController.createTask
);
router.get("/gettask", taskController.getTask);

router.get("/gettask/priority", taskController.getTasksByPriorityPagination);

router.patch("/updatetask/:id", taskController.UpdateTask);

module.exports = router;
