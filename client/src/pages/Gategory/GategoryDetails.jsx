import React, { useState } from 'react'

import { RouteAddCategory, RouteEditCategory } from '@/helper/RouteName'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helper/GetEnv'
import { showToast } from '@/helper/ShowToast'

import Loading from '@/components/Loading'

import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

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


function GategoryDetails() {

    const [refreshData, setRefreshData] = useState(false)

    // Fetch :- list of all Category
    const { data: categoryData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
        method: 'get',
        credentials: 'include'
    }, [refreshData])
    // console.log("categoryData", categoryData);

    // Fetch :- Dalete the Perticuler Category
    const handleDelete = async (id) => {
        // console.log(values);
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/delete/${id}`, {
                method: 'delete',
            })
            if (response) {
                setRefreshData(!refreshData)
                showToast('success', 'Data deleted.')
            } else {
                showToast('error', 'Data not deleted.')
            }
        } catch (error) {
            showToast('error', error.message)
        }
    }

    if (loading) return <Loading />
    return (
        <div>
            <Card>
                <CardHeader>
                    <div>
                        <Button asChild>
                            <Link to={RouteAddCategory}>
                                Add Category
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category </TableHead>
                                <TableHead>Slug </TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* Lsit of All Category with Update - Delete  */}
                        <TableBody>
                            {categoryData && categoryData?.category.length > 0 ?
                                categoryData?.category?.map(category =>
                                    <TableRow key={category._id}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell className="flex gap-3">
                                            <Button variant="outline" className="hover:bg-violet-500 hover:text-white" asChild>
                                                <Link to={RouteEditCategory(category._id)}>
                                                    <FiEdit />
                                                </Link>
                                            </Button>
                                            <Button onClick={() => handleDelete(category._id)} variant="outline" className="hover:bg-violet-500 hover:text-white" >
                                                <FaRegTrashAlt />
                                            </Button>
                                        </TableCell>
                                    </TableRow>)
                                : <TableRow>
                                    <TableCell colSpan="3">
                                        Data not found.
                                    </TableCell>
                                </TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default GategoryDetails