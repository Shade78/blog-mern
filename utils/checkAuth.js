// функция-посредник; можно ли возвращать какую-либо информацию (middleware)

import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""); // достаем токен из запроса и убираем лишнее

  if (token) {
    try {
      const decodedToken = jwt.verify(token, "secret123"); // расшифровка токена

      req.userId = decodedToken._id; // потом можно вытащить id пользователя в другом месте

      next();
    } catch (err) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
