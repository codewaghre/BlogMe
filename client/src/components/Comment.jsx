import React, { useState } from 'react'

import CommensList from './CommensList';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

import { FaComments } from "react-icons/fa";

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Link } from 'react-router-dom';

import { RouteSignUp } from '../helper/RouteName';
import { getEnv } from '@/helper/GetEnv';
import { showToast } from '@/helper/ShowToast';

import { useSelector } from 'react-redux';

function Comment({ props }) {

    const user = useSelector((state) => state.user)
    const [newComment, setNewComment] = useState()

    const formSchema = z.object({
        comment: z.string().min(3, 'Comment must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: '',
        },
    })

    // Fetch :- Add Comment
    async function onSubmit(values) {
        try {
            const newValues = { ...values, blogid: props.blogid, user: user.user._id }

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/comment/add`, {
                method: 'post',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(newValues)
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            setNewComment(data.comment)
            form.reset()
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <div>
            <h4 className='flex items-center gap-2 text-2xl font-bold'> <FaComments className='text-black' /> Comment</h4>

            {user && user.isLoggedIn
                ?
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}  >
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type your comment..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" >Submit</Button>
                    </form>
                </Form>
                :
                <Button asChild>
                    <Link to={RouteSignUp}>Sign In </Link>
                </Button>
            }

            <div className='mt-5'>
                <CommensList props={{ blogid: props.blogid, newComment }} />
            </div>

        </div>
    )
}

export default Comment