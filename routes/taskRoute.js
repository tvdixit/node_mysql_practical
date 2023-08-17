const express = require("express");
const taskController = require("../controlller/taskController");
const router = express.Router();

router.post(
  "/createtask",
  taskController.upload.single("image"),
  taskController.createTask
);
router.get("/gettask", taskController.gettask);

router.get("/gettask/priority", taskController.getTasksByPriorityPagination);

module.exports = router;
