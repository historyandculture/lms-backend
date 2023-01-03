// In src/index.js 
const express = require("express");
const cookieParser = require('cookie-parser');
var swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// For testing purposes 
app.get("/", (req, res) => {
    res.send("<h2>It's Working!</h2>");
});

app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
);

app.use("/user", require("./routes/user"));
app.use("/", require("./routes/jwt"));
app.use("/todo", require("./routes/todo"));

app.listen(PORT, () => {
    console.log(`API is listening on port  ${PORT}`);
});