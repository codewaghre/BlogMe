import React from 'react'
import { useParams } from 'react-router-dom'

import { getEnv } from '@/helper/GetEnv'
import { useFetch } from '@/hooks/useFetch'

import CommentCount from '@/components/CommentCount'
import Loading from '@/components/Loading'

import { Avatar } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'

import moment from 'moment'
import { decode } from 'entities'
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import Comment from '@/components/Comment'
import LikeCount from '@/components/LikeCount'
import Error from '@/components/Error'
import RelatedBlog from '@/components/RelatedBlog'
import '@/test.css'


function SingleBlogPage() {
    const { blog, category } = useParams()
    console.log(category);


    // Fetch :- 
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-blog/${blog}`, {
        method: 'get',
        credentials: 'include',
    }, [blog, category])
    // console.log("data", data.blog._id);

    // Ensure data and data.blog are defined before accessing properties
    if (!data && error) {
        return <div><Error /></div>;
    }

    // Safely access blogContent using optional chaining
    const blogContent = data?.blog?.blogContent || '';
    // console.log('Blog Content:', blogContent);

    // Decode, convert, and sanitize the content only if blogContent exists
    let sanitizedContent = '';

    if (blogContent) {
        const decodedContent = decode(blogContent);
        // console.log('Decoded Content:', decodedContent);

        const htmlContent = marked(decodedContent);
        // console.log('HTML Content:', htmlContent);

        sanitizedContent = DOMPurify.sanitize(htmlContent);
        // console.log('Sanitized Content:', sanitizedContent);
    }

    if (loading) return <Loading />
    return (
        <div className='md:flex-nowrap flex-wrap flex justify-between gap-10'>
            {data && data.blog &&
                <>
                    <div className='border rounded md:w-[70%] w-full p-5'>
                        <h1 className='text-2xl font-bold mb-5'>{data.blog.title}</h1>
                        <div className='flex justify-between items-center'>
                            <div className='flex justify-between items-center gap-5'>
                                <Avatar>
                                    <AvatarImage src={data.blog.author.avatar} />
                                </Avatar>
                                <div>
                                    <p className='font-bold'>{data.blog.author.name}</p>
                                    <p>Date: {moment(data.blog.createdAt).format('DD-MM-YYYY')}</p>
                                </div>
                            </div>
                            <div className='flex justify-between items-center gap-5'>
                                <LikeCount props={{ blogid: data.blog._id }} />
                                <CommentCount props={{ blogid: data.blog._id }} />
                            </div>
                        </div>
                        <div className='my-5'>
                            <img src={data.blog.featuredImage} className='rounded' />
                        </div>
                        <div className='blog-content' dangerouslySetInnerHTML={{ __html: sanitizedContent || '' }} />

                        <div className='border-t mt-5 pt-5'>
                            <Comment props={{ blogid: data.blog._id }} />
                        </div>


                    </div>
                </>

            }
            <div className='border rounded md:w-[32%] w-full p-5 hidden md:block'>
                <RelatedBlog props={{ category: category, currentBlog: blog }} />
            </div>
        </div>
    )
}

export default SingleBlogPage