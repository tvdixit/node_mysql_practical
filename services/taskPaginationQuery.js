// const taskQuery = async (req, priority, is_completed, is_deleted) => {
const taskQuery = async (priority, is_completed, is_deleted, id) => {
  //   console.log(priority, is_completed, is_deleted, id, "jheebjgxzsdjv");
  let sql = `
      SELECT * FROM task WHERE user_id = ${id} AND
      ${priority !== "all" ? `priority = '${priority}'` : "1"}
      AND
      (is_completed = '${is_completed}' OR '${is_completed}' = 'all')
      AND
      (is_deleted = '${is_deleted}' OR '${is_deleted}' = 'all')
    `;
  //   console.log(sql);
  return sql;
};
module.exports = {
  taskQuery,
};
