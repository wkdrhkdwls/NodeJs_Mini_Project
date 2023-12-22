const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json()); // http 외 모듈 'json'

let db = new Map();
let id = 1; // 하나의 객체를 유니크하게 구별하기 위함

// 로그인
router.post("/login", function (req, res) {
  // id가 DB에 저장된 회원인지 확인하셔야
  const { userId, password } = req.body;

  let loginUser = {};

  db.forEach(function (user, id) {
    if (user.userId === userId) {
      loginUser = user;
    }
  });

  // userId 값을 못 찾았으면...
  if (isExist(loginUser)) {
    if (user.password == password) {
      res.status(200).json({
        message: `${loginUser.name}님 로그인 되었습니다.`,
      });
    } else {
      res.status(400).json({
        message: `비밀번호가 틀렸습니다.`,
      });
    }
  } else {
    res.status(400).json({
      message: `회원 정보가 없습니다.`,
    });
  }

  // pwd도 맞는지 비교
});

function isExist(obj) {
  if (Object.keys(obj).length) {
    return true;
  } else {
    return false;
  }
}
// 회원가입
router.post("/join", function (req, res) {
  console.log(req.body);

  if (req.body == {}) {
    res.status(400).json({
      message: `입력 값을 다시 확인해주세요.`,
    });
  } else {
    const { email, name, password, contact } = req.body;

    conn.query(
      `INSERT INTO users (email,name,password,contact) VALUES (?,?,?,?)`,
      [email, name, password, contact],
      function (err, results, fields) {
        res.status(201).json(results);
      }
    );
  }
});

router
  .route("/users")
  .get(function (req, res) {
    let { email } = req.body;
    conn.query(
      `SELECT * FROM users WHERE email = ?`,
      email,
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  })
  .delete(function (req, res) {
    let { userId } = req.body;

    const user = db.get(userId);
    if (user) {
      db.delete(id);
      res.status(200).json({
        message: `${user.name}님 다음에 또 뵙겠습니다.`,
      });
    } else {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    }
  });

module.exports = router;
