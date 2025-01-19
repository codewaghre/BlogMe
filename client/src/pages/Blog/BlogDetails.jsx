import React, { useState, useEffect } from 'react'

import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helper/GetEnv'
import { showToast } from '@/helper/ShowToast'
import { RouteBlogAdd, RouteBlogEdit, RouteEditCategory } from '@/helper/RouteName'
import { deleteData } from '@/helper/handleDelete'

import Loading from '@/components/Loading'

import { Button } from '@/components/ui/button'
import { Link, useParams } from 'react-router-dom'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

import moment from 'moment'



function BlogDetails() {
    const [refreshData, setRefreshData] = useState(false)

    // Fetch :- All Blogs list
    const { data: blogData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/all-blogs`, {
        method: 'get',
        credentials: 'include'
    }, [refreshData])



    // Delete Blog
    const handleDelete = async (id) => {
        // console.log(id);

        const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`)

        if (response) {
            setRefreshData(!refreshData)
            showToast('success', 'Data deleted.')
        } else {
            showToast('error', 'Data not deleted.')
        }
    }

    if (loading) return <Loading />
    return (
        <div>
            <Card>
                <CardHeader>
                    <div>
                        <Button asChild>
                            <Link to={RouteBlogAdd}>
                                Add Blog
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Author </TableHead>
                                <TableHead>Category </TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Dated</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* List of Blogs and edit - delete  */}
                        <TableBody>
                            {blogData && blogData.blog.length > 0 ?

                                blogData.blog.map(blog =>
                                    <TableRow key={blog._id}>
                                        <TableCell>{blog?.author?.name}</TableCell>
                                        <TableCell>{blog?.category?.name}</TableCell>
                                        <TableCell>{blog?.title}</TableCell>
                                        <TableCell>{blog?.slug}</TableCell>
                                        <TableCell>{moment(blog?.createdAt).format('DD-MM-YYYY')}</TableCell>

                                        <TableCell className="flex gap-3">
                                            <Button variant="outline" className="hover:bg-violet-500 hover:text-white" asChild>
                                                <Link to={RouteBlogEdit(blog._id)}>
                                                    <FiEdit />
                                                </Link>
                                            </Button>
                                            <Button onClick={() => handleDelete(blog._id)} variant="outline" className="hover:bg-violet-500 hover:text-white" >
                                                <FaRegTrashAlt />
                                            </Button>
                                        </TableCell>
                                    </TableRow>

                                )

                                :

                                <TableRow>
                                    <TableCell colSpan="3">
                                        Data not found.
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default BlogDetails