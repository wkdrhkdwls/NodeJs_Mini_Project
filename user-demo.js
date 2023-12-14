const express = require("express");
const app = express();
app.listen(7777);
app.use(express.json()); // http 외 모듈 'json'

let db = new Map();
var id = 1; // 하나의 객체를 유니크하게 구별하기 위함

// 로그인
app.post("/login", function (req, res) {
  // id가 DB에 저장된 회원인지 확인하셔야
  const { userId, password } = req.body;

  var loginUser = {};

  db.forEach(function (user, id) {
    if (user.userId === userId) {
      loginUser = user;
    }
  });

  // userId 값을 못 찾았으면...
  if (isExist(loginUser)) {
    console.log("같다!");

    if (user.password == password) {
      console.log("패스워드 같다");
    } else {
      console.log("패스워드 다르다");
    }
  } else {
    console.log("입력하신 아이디는 없는 아이디 입니다.");
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
app.post("/join", function (req, res) {
  console.log(req.body);

  if (req.body == {}) {
    res.status(400).json({
      message: `입력 값을 다시 확인해주세요.`,
    });
  } else {
    db.set(id++, req.body);

    res.status(201).json({
      message: `${db.get(id - 1).name}님 환영합니다.`,
    });
  }
});

app
  .route("/users/:id")
  .get(function (req, res) {
    let { id } = req.params;
    id = parseInt(id);

    const user = db.get(id);
    if (user == undefined) {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    } else {
      res.status(200).json({
        userId: user.userId,
        name: user.name,
      });
    }
  })
  .delete(function (req, res) {
    let { id } = req.params;
    id = parseInt(id);

    const user = db.get(id);
    if (user == undefined) {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    } else {
      db.delete(id);
      res.status(200).json({
        message: `${user.name}님 다음에 또 뵙겠습니다.`,
      });
    }
  });
