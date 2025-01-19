import Comment from "../models/comment.model.js";
import { handleError } from "../utils/apiErrorHandler.js";

//add Comment
const addComment = async (req, res, next) => {

    try {
        const { user, blogid, comment } = req.body

        const comments = new Comment({
            user: user,
            blogid: blogid,
            comment: comment
        })
        await comments.save()

        res.status(200).json({
            success: true,
            message: 'Comment submited.',
            comment: comments
        })



    } catch (error) {
        next(handleError(500, error.message))
    }
}

// get comment 
const getComments = async (req, res, next) => {

    try {
        const { blogid } = req.params
        const comments = await Comment.find({ blogid }).populate('user', 'name avatar').sort({ createdAt: -1 }).lean().exec()

        res.status(200).json({
            comments
        })
    } catch (error) {
        next(handleError(500, error.message))
    }

}

//Count Comment
const commentCount = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const commentCount = await Comment.countDocuments({ blogid })

        res.status(200).json({
            commentCount
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

// get all Comments
const getAllComments = async (req, res, next) => {
    try {
        const user = req.user
        let comments
        if (user.role === 'admin') {
            comments = await Comment.find().populate('blogid', 'title').populate('user', 'name')

        } else {

            comments = await Comment.find({ user: user._id }).populate('blogid', 'title').populate('user', 'name')
        }


        res.status(200).json({
            comments
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

// deleteComment
const deleteComment = async (req, res, next) => {
    try {
        const { commentid } = req.params
        await Comment.findByIdAndDelete(commentid)

        res.status(200).json({
            success: true,
            message: 'Data deleted'
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}


export {
    addComment,
    getComments,
    commentCount,
    getAllComments,
    deleteComment
}