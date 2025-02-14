import React, { useState } from 'react'

import { RouteAddAdmin } from '@/helper/RouteName'
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

import moment from 'moment'
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

function AdminDetails() {

    const [refreshData, setRefreshData] = useState(false)

    // Fetch :- list of all Category
    const { data: adminData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/admin/get-admin`, {
        method: 'get',
        credentials: 'include'
    }, [refreshData])



    // Fetch :- Dalete the Perticuler Category
    const handleDelete = async (id) => {
        // console.log(values);
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/admin/delete/${id}`, {
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

    return (
        <div>
            <Card>
                <CardHeader>
                    <div>
                        <Button asChild>
                            <Link to={RouteAddAdmin}>
                                Add Admin
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role </TableHead>
                                <TableHead>Name </TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Avatar</TableHead>

                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* Lsit of All Category with Update - Delete  */}
                        <TableBody>
                            {adminData && adminData?.data?.length > 0 ?
                                adminData?.data?.map((admin) =>
                                    <TableRow key={admin?.role}>
                                        <TableCell>{admin?.role}</TableCell>
                                        <TableCell>{admin?.name}</TableCell>
                                        <TableCell>{admin?.email}</TableCell>
                                        <TableCell>
                                            <img src={admin?.avatar || " "} className='w-10' />
                                        </TableCell>
                                        <TableCell>{moment(admin?.createdAt).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell className="flex gap-3">
                                            <Button onClick={() => handleDelete(admin._id)} variant="outline" className="hover:bg-violet-500 hover:text-white" >
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

export default AdminDetails