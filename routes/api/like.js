const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const Like = require("../../models/Like");

// @route   POST api/like
// @desc    Get like by user's email
// @access  Private
router.post("/getLike", auth, (req, res) => {
  const { email } = req.body;
  console.log("getLike", email);
  // console.log("email", email);
  // Check for existing user
  Like.findOne({ email })
    .then(like => {
    console.log("getLike");
    if (!like) {
      const newLike = new Like({
        email,
        like: []
      });
      newLike.save().then(like => {
        res.json(like.like);
      });
    } else {
      res.json(like.like);
    }
  })
  .catch(err => {
    return res.status(400).json({ msg: "Failed to getLike" });
  });
});
// @route   POST api/like
// @desc    Add a Like
// @access  Private
router.post('/addLike', auth, (req, res) => {
  const { email, like } = req.body;
  console.log("addLike", req.body);
  const query = { email: email.toString() };
  const update = {
    $push: {
      like: like
    }
  };
  Like.updateOne(query, update)
    .then(result => {
      const { ok } = result;
      if (ok) {
        console.log(`Successfully added a new like.`);
      }
      res.json(result);
    })
    .catch(err => {
      console.error(`Failed to add review: ${err}`)
      return res.status(400).json({ msg: `Failed to add review: ${err}` });
    });
  
});
// @route   POST api/like
// @desc    set likeItem'join
// @access  Private
// unFinish
router.post("/setJoin", auth, (req, res) => {
  const { email, serial_no, acadm_year, acadm_term, isJoin } = req.body;
  // console.log("typeof", typeof isJoin)
  console.log("setJoin", req.body);
  const query = {
    email: email.toString(),
    "like.serial_no": serial_no.toString(),
    "like.acadm_year": acadm_year.toString(),
    "like.acadm_term": acadm_term.toString()
  };
  const update = {
    $set: {
      // serial_no: true
      "like.$.isJoin": isJoin
    }
  };
  Like.updateOne(query, update, { multi: true })
    .then(result => {
      const { ok } = result;
      if (ok) {
        console.log(`Successfully set isJoin.`);
      }
      res.json(result);
    })
    .catch(err => {
      console.error(`Failed to set isJoin review: ${err}`);
      return res.status(400).json({ msg: `Failed to set isJoin review: ${err}` });
    });
});
// @route   POST api/like
// @desc    Delete a Like
// @access  Private
router.post("/deleteLike", auth, (req, res) => {
  const { email, serial_no, acadm_year, acadm_term } = req.body;
  console.log('deleteLike', req.body);
  const query = { email: email.toString() };
  const update = {
    $pull: {
      like: {
        serial_no: serial_no.toString(),
        acadm_year: acadm_year.toString(),
        acadm_term: acadm_term.toString(),
      },
      // like: { "id": "10"}
    },
  };
  Like.updateOne(query, update, { multi: true })
    .then(result => {
      const { ok } = result;
      if (ok) {
        console.log(`Successfully deleted a like.`);
      }
      res.json(result);
    })
    .catch(err => {
      console.error(`Failed to delete review: ${err}`)
      return res.status(400).json({ msg: `Failed to delete review: ${err}` });
    });
});
// @route   POST api/like
// @desc    Delete ALL Like
// @access  Private
router.post("/deleteALLLike", auth, (req, res) => {
  const { email } = req.body;
  const query = { email: email.toString() };
  const update = {
    $set: {
      like: []
    }
  };
  Like.updateOne(query, update, { multi: true })
    .then(result => {
      const { ok } = result;
      if (ok) {
        console.log(`Successfully deleted ALL like.`);
      }
      res.json(result);
    })
    .catch(err => {
      console.error(`Failed to delete ALL like review: ${err}`);
      return res
        .status(400)
        .json({ msg: `Failed to delete ALL review: ${err}` });
    });
});

module.exports = router;
