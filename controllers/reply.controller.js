const { Reply } = require("../models/Reply.model");
const Thread = require("../models/Thread.model");
const {
  createReply,
  getAllReplies,
  getAllChildReplies,
} = require("../services/reply.service");

module.exports.createReplyHandler = async (req, res, next) => {
  try {
    const thread = await Thread.findOne({
      threadNumber: req.body.threadNumber,
    });

    let parentReply, parentReplyId;
    if (req.body.parentReplyId) {
      parentReply = await Reply.findOne({
        replyNumber: req.body.parentReplyNumber,
      });
      parentReplyId = parentReply._id;
    } else {
      parentReplyId = null;
    }

    console.log(thread);
    const threadId = thread._id;
    console.log(threadId);
    const reply = await createReply({
      threadId,
      parentReplyId: parentReplyId,
      text: req.body.text,
      user: req.body.user,
      userIP: req.ip,
    });
    reply.save();
    res.status(201).json({
      message: "Reply created",
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllRepliesHandler = async (req, res, next) => {
  try {
    const replies = await getAllReplies();
    res.status(200).json({
      message: "All replies fetched",
      data: replies,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllChildReplies = async (req, res, next) => {
  try {
    const parentReplyId = req.body.prId;
    const childReplies = await getAllChildReplies(parentReplyId);
    res.status(200).json({
      message: `All child fetched for ${parentReplyId}`,
      data: childReplies,
    });
  } catch (error) {
    next(error);
  }
};
