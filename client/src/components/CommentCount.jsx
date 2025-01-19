import React from 'react'

import { FaRegComment } from "react-icons/fa";

import { getEnv } from '@/helper/GetEnv';
import { useFetch } from '@/hooks/useFetch';



function CommentCount({ props }) {

    // Fetch - Count of Comments
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/comment/get-count/${props.blogid}`, {
        method: 'get',
        credentials: 'include',
    })

    return (
        <button type='button' className='flex justify-between items-center gap-1'>
            <FaRegComment />
            {data && data.commentCount}
        </button>
    )
}

export default CommentCount