import express, { type Application } from "express";
import { routes } from "../routes";

const app: Application = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});