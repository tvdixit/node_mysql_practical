const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoute");

const app = express();
app.use(bodyParser.json());
app.use(userRoutes);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
