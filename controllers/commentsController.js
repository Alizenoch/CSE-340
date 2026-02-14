const Comment = require("../models/comment");

/* ******************************
* Create a new comment
* ***************************** */
exports.addComment = async (req, res) => {
  try {
    // Guard: Ensure user is logged  in
    if(!req.session.account) {
      req.flash("error", "You must be logged in to add a comment.");
      return res.redirect("/account/login");
    }
    const { content } = req.body;
    const accountId = req.session.account.account_id; // logged-in account ID
    const inventoryId = req.params.id;

    // Validation: Ensure content is not empty
    if (!content || content.trim() === "") {
      req.flash("error", "Comment cannot be empty.");
      return res.redirect(`/inv/details/${inventoryId}`);
    }

    await Comment.create(accountId, inventoryId, content);
    req.flash("success", "Comment added successfully!");
    res.redirect(`/inv/details/${inventoryId}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    req.flash("error", "Failed to add comment. Please try again.");
    res.redirect(`/inv/details/${inventoryId}`);
  }
};

/* ******************************
* Delete a comment
* ***************************** */
exports.deleteComment = async (req, res) => {
  try {
    // Guard: Ensure user is logged in
    if(!req.session.account) {
      req.flash("error", "You must be logged in to delete a comment.");
      return res.redirect("/account/login");
    }

    const commentId = req.params.id; // match route definition
    const accountId = req.session.account.account_id; // logged-in account ID

    // Use the boolean return from Comment.delete
  const deleted = await Comment.delete(commentId, accountId);

  if (deleted) {
    req.flash("success", "Comment deleted successfully!");
  } else {
    req.flash("error", "Comment could not be deleted. It may not exist or you don't have permission.");
  }

  res.redirect("back"); // redirect to the prevoius page
  } catch (error) {
    console.error("Error deleting comment:", error);
    req.flash("error", "Failed to delete comment. Please try again.");
    res.redirect("back");
  }
};
