import BlogLike from "../models/like.model.js";
import { handleError } from "../utils/apiErrorHandler.js";


const doLike = async (req, res, next) => {

    try {

        const { user, blogid } = req.body

        let like = await BlogLike.findOne({ user, blogid });

        if (!like) {

            const saveLike = new BlogLike({
                user,
                blogid
            });
            like = await saveLike.save();
        } else {

            await BlogLike.findByIdAndDelete(like._id);
        }

        const likecount = await BlogLike.countDocuments({ blogid });
        // console.log("like count", likecount);

        res.status(200).json({
            likecount
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}


const countLike = async (req, res, next) => {

    try {
        const { blogid, userid } = req.params
        const likecount = await BlogLike.countDocuments({ blogid })

        let isUserliked = false
        if (userid) {
            const getUserLike = await BlogLike.countDocuments({ blogid, user: userid })

            if (getUserLike > 0) {
                isUserliked = true
            }
        }

        res.status(200).json({
            likecount,
            isUserliked
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}



export {
    doLike,
    countLike
}