import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.1rhdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

const app = express();

app.use(express.json()); // позволяет читать json из запросов

app.get("/", (req, res) => {
  res.send("1111");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);

  if (req.body.email === "test@test.ru") {
    const token = jwt.sign(
      {
        email: req.body.email,
        fullname: "Иван Иванов",
      },
      "secret123"
    );
  }

  res.json({
    success: true,
    token,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
