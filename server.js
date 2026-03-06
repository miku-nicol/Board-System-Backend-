const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs")
const dotenv = require("dotenv");
const userRouter = require("./src/modules/User/authRoutes");
const boardRouter = require("./src/modules/board/boardRoutes");
const columnRouter = require("./src/modules/column/columnRoutes");
const cardRouter = require("./src/modules/card/cardRoutes");
const tagRouter = require("./src/modules/tag/tagRoutes");
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(cors());
 app.use(express.json());


 dotenv.config();

 
app.use("/api/v1/user", userRouter);
app.use("/api/v1/boards", boardRouter);
app.use('/api/v1/column', columnRouter);
app.use('/api/v1/card', cardRouter);
app.use('/api/v1/tag', tagRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 
app.get("/", (req, res) => {
    res.end(`Begining of Talenvo program`);
 });


connectDB()
 const PORT= process.env.PORT;

 app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);

 })