import express, { type Application } from "express";
import { routes } from "../routes";
import cors from "cors"

const app: Application = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
