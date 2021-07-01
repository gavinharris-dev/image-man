import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import fileUpload from "express-fileupload";
import indexRouter from "./routes/index";

const app = express();

app.use(fileUpload());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(indexRouter);

export default app;
