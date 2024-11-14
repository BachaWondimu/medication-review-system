import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import "dotenv/config";
import medicationsRouter from "./medications/medications.router.js";
import usersRouter from "./users/users.router.js";
import { ErrorResponse } from "./error.js";

/*
added code
*/
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

(async function () {
  try {
    if (process.env.DB_SERVER_URL) {
      await mongoose.connect(process.env.DB_SERVER_URL);
      console.log(`MongoDB server is connected successfully`);
    } else {
      throw new Error(`DB server URL is not found`);
    }
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();

app.use(cors());
app.use(morgan("dev"));
app.use(json());

/*
added code
*/
app.use(express.static(path.join(__dirname, "deploy/dist/frontend/browser")));

// Routes
app.use("/users", usersRouter);
app.use("/medications", medicationsRouter);

/*
added code
*/
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "deploy/dist/frontend/browser", "index.html"));
});

app.all("*", async (req, res, next) =>
  next(new ErrorResponse(`Route not found`, 404))
);

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ success: false, data: error.message });
});

app.listen(3000, () => console.log(`Express server is listening on port 3000`));
