const express = require('express');
const router = express.Router();
const commentsController = require("../controllers/commentsController");

// Add a comment
router.post("/add/:id/comments", commentsController.addComment);

// Delete a comment
router.post("/delete/:id/comments", commentsController.deleteComment);

module.exports = router