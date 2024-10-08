import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";

import { UserController, PostController } from "./controllers/index.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.1rhdw.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

const app = express();
app.use(express.json()); // позволяет читать json из запросов
app.use(cors());
app.use("/uploads", express.static("uploads")); // по сути get запрос на получение статичного файла

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("main page is ok");
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// app.get("/tags", PostController.getLastTags);

// для всех
app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);

// только для авторизованных
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
); // сначала проверяем есть ли права у пользователя, потом валидируем пост
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log("213", err);
  }

  console.log("Server OK");
});
