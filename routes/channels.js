const express = require("express");
const router = express.Router();

router.use(express.json());

let db = new Map();
let id = 1;

router
  .route("/")
  .get((req, res) => {
    let { userId } = req.body;
    let channels = [];
    if (db.size && userId) {
      db.forEach(function (value, key) {
        if (value.userId === userId) {
          channels.push(value);
        }
      });

      if (channels.length) {
        res.status(200).json(channels);
      } else {
        notFoundChannel();
      }
    } else {
      notFoundChannel();
    }
  })
  .post((req, res) => {
    if (req.body.channelTitle) {
      let channel = req.body;
      db.set(id++, channel);

      res.status(201).json({
        message: `${db.get(id - 1).channelTitle}채널을 응원합니다.`,
      });
    } else {
      res.status(400).json({
        message: "요청 값을 제대로 보내주세요.",
      });
    }
  }); // 채널 개별 생성 = db에 저장

router
  .route("/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    let channel = db.get(id);
    if (channel) {
      res.status(200).json(channel);
    } else {
      notFoundChannel();
    }
  })
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    let channel = db.get(id);
    let oldTitle = channel.channelTitle;
    if (channel) {
      let newTitle = req.body.channelTitle;

      channel.channelTitle = newTitledb.set(id, channel);

      res.json({
        message: `채널명이 ${oldTitle}에서 ${newTitle}로 수정되었습니다.`,
      });
    } else {
      notFoundChannel();
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    let channel = db.get(id);
    if (channel) {
      db.delete(id);

      res.status(200).json({
        message: `${channel.channelTitle}이 정상적으로 삭제되었습니다.`,
      });
    } else {
      notFoundChannel();
    }
  });

function notFoundChannel() {
  res.status(404).json({
    message: "채널 정보를 찾을 수 없습니다.",
  });
}

module.exports = router;
