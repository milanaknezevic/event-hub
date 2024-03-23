const Comment = require("../models/comment");
const Event = require("../models/event");
const User = require("../models/user");

const addComment = async (req, res) => {
    try {
        const commentData = {
            question: req.body.question,
            answer: null,
            mark: req.body.mark ? req.body.mark : null,
            creationDate: req.body.creationDate,
            event_id: req.body.event_id,
            user_id: req.body.user_id,
        };

        const newComment = await Comment.create(commentData);
        res.status(201).json({
            message: 'Comment added succesfuly',
        });
    } catch (error) {
        console.log("error ", error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const getAllComments = async (req, res) => {
    try {
        let comments = await Comment.findAll({});
        res.status(200).send({comments});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const replyComment = async (req, res) => {
    try {
        const commentId = req.params.id;

        const answer = {
            answer: req.body.answer
        }
        const existingComment = await Comment.findByPk(commentId);
        if (!existingComment) {
            return res.status(404).json({success: false, message: 'Comment not found.'});
        }
        // await existingComment.update(answer);
        await Comment.update(answer, {
            where: {id: commentId}
        });

        res.status(200).json({
            message: 'Comment updated succesfuly',
        });
    } catch (error) {
        console.log("error ", error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}


module.exports = {
    addComment,
    getAllComments,
    replyComment
}