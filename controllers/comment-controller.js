const Comment = require("../models/comment");

const addComment = async (req, res) => {
    try {
        const commentData = {
            question: req.body.question,
            answer: req.body.answer ? req.body.answer : null,
            mark: req.body.mark ? req.body.mark : null,
            creationDate: req.body.creationDate,
            event_id: req.body.event_id,
            user_id: req.body.user_id,
        };

        const newComment = await Comment.create(commentData);
        res.status(201).json({
            message: 'Comment added succesfuly',
            eventType: newComment
        });
    } catch (error) {
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

module.exports = {
    addComment,
    getAllComments
}