const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next(); // 다음 할 일(미들 웨어, 함수)
  } else {
    return res.status(400).end(err.array());
  }
};

function notFoundChannel(res) {
  res.status(404).json({
    message: "채널 정보를 찾을 수 없습니다.",
  });
}

router
  .route("/")
  .get(
    [body("userId").notEmpty().isInt().withMessage("숫자를 입력!"), validate],
    (req, res, next) => {
      let { userId } = req.body;

      let sql = `SELECT * FROM channels WHERE user_id = ?`;

      conn.query(sql, userId, function (err, results) {
        if (err) return res.status(400).end();

        if (results.length) res.status(200).json(results);
        else notFoundChannel(res);
      });

      res.status(400).end();
    }
  )
  .post(
    [
      body("userId").notEmpty().isInt().withMessage("숫자를 입력!"),
      body("name").notEmpty().isString().withMessage("문자 입력 필요!"),
      validate,
    ], // 비면 안되고 정수여야한다.
    (req, res) => {
      const { name, userId } = req.body;
      let sql = `INSERT INTO channels (name, user_id) VALUES (?,?)`;
      let values = [name, userId];

      conn.query(sql, values, function (err, results) {
        if (err) return res.status(400).end();
        res.status(201).json(results);
      });
    }
  );

router
  .route("/:id")
  .get(
    [param("id").notEmpty().withMessage("채널id 필요"), validate],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);

      let sql = `SELECT * FROM channels WHERE id = ?`;

      conn.query(sql, id, function (err, results) {
        if (err) return res.status(400).end();

        if (results.length) res.status(200).json(results);
        else notFoundChannel(res);
      });
    }
  )
  .put(
    [
      param("id".notEmpty().withMessage("채널id 필요")),
      body("name").notEmpty().isString.withMessage("채널명 오류"),
      validate,
    ],
    (req, res) => {
      const err = validationResult(req);

      if (!err.isEmpty()) return res.status(400).end(err.array());

      let { id } = req.params;
      id = parseInt(id);
      let { name } = req.body;

      let sql = `UPDATE channels SET name = ? WHERE id = ?`;
      let values = [name, id];

      conn.query(sql, values, function (err, results) {
        if (err) return res.status(400).end();

        if (results.affectedRows == 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  )
  .delete(
    [param("id").notEmpty().withMessage("채널id 필요"), validate],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);

      let sql = `DELETE FROM channels WHERE id = ?`;

      conn.query(sql, id, function (err, results) {
        if (err) return res.status(400).end();

        if (results.affectedRows == 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  );

module.exports = router;
