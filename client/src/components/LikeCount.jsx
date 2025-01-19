import React, { useEffect, useState } from 'react'

import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

import { getEnv } from '@/helper/GetEnv';
import { useFetch } from '@/hooks/useFetch';
import { showToast } from '@/helper/ShowToast';

import { useSelector } from 'react-redux';



function LikeCount({ props }) {

    const user = useSelector(state => state.user)

    const [likeCount, setLikeCount] = useState(0)
    const [hasLiked, setHasLiked] = useState(false)

    // Fetch :- get like counts
    const { data: blogLikeCount, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog-like/get-like/${props.blogid}/${user && user.isLoggedIn ? user.user._id : ''}`, {
        method: 'get',
        credentials: 'include',
    },)


    useEffect(() => {
        if (blogLikeCount) {
            setLikeCount(blogLikeCount.likecount || 0);
            setHasLiked(blogLikeCount.isUserliked || false);
        }
    }, [blogLikeCount])

    // fetch:- send the like
    const handleLike = async () => {
        try {
            if (!user.isLoggedIn) {
                return showToast('error', 'Please login into your account.')
            }

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog-like/do-like`, {
                method: 'post',
                credentials: 'include',
                headers: { 'Content-type': "application/json" },
                body: JSON.stringify({ user: user?.user._id, blogid: props.blogid })
            })

            if (!response.ok) {
                showToast('error', response.statusText)
            }

            const responseData = await response.json()
            setLikeCount(responseData.likecount)
            setHasLiked(!hasLiked)

        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <button onClick={handleLike} type='button' className='flex justify-between items-center gap-1'>
            {!hasLiked ?
                <FaRegHeart />
                :
                <FaHeart fill='red' />
            }
            {likeCount}
        </button>
    )
}

export default LikeCount