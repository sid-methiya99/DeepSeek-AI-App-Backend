const express = require("express");
const cors = require("cors");
const { router } = require("./routes");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/", router);

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
