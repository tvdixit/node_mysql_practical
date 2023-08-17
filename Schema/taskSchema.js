const Connection = require("../config/db");

const createTask = (task, callback) => {
  const sql =
    "INSERT INTO task (name, description, image, user_id, due_date, priority, is_completed, is_deleted) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    task.name,
    task.description,
    task.image,
    task.user_id,
    task.due_date,
    task.priority,
    task.is_completed,
    task.is_deleted,
    task.created_date,
  ];

  Connection.query(sql, values, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  createTask,
};
