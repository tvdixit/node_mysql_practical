// const taskQuery = async (req, priority, is_completed, is_deleted) => {
const taskQuery = async (priority, is_completed, is_deleted, id) => {
  // let sql = `
  //     SELECT * FROM task WHERE user_id = ${id} AND
  //     ${priority !== "all" ? `priority = '${priority}'` : "1"}
  //     AND
  //     (is_completed = '${is_completed}' OR '${is_completed}' = 'all')
  //     AND
  //     (is_deleted = '${is_deleted}' OR '${is_deleted}' = 'all')
  //   `;

  let sql = `
  SELECT user.first_name, user.email, task.*
  FROM task
  INNER JOIN user ON task.user_id = user.id
  WHERE user_id = ${id}
    AND ${priority !== "all" ? `priority = '${priority}'` : "1"}
    AND (is_completed = '${is_completed}' OR '${is_completed}' = 'all')
    AND (is_deleted = '${is_deleted}' OR '${is_deleted}' = 'all')
ORDER BY task.priority`;

  return sql;
};
module.exports = {
  taskQuery,
};
