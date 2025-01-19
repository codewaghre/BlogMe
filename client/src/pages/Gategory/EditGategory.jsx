import React, { useEffect } from 'react'

import slugify from 'slugify'
import Loading from '@/components/Loading'

import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { showToast } from '@/helper/ShowToast'
import { getEnv } from '@/helper/GetEnv'
import { RouteCategoryDetails } from '@/helper/RouteName'
import { useFetch } from '@/hooks/useFetch'

function EditGategory() {

    const navigate = useNavigate()
    const { category_id } = useParams()
    // console.log(category_id);

    // Fetch = Perticuler Category Using ID
    const { data: categoryData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/show/${category_id}`, {
        method: 'get',
        credentials: 'include'
    }, [category_id])

    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 character long.'),
        slug: z.string().min(3, 'Slug must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    })


    // Fetch :- Update  Specific Category 
    async function onSubmit(values) {
        // console.log(values);

        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/update/${category_id}`, {
                method: 'put',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values)
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            showToast('success', data.message)
            navigate(RouteCategoryDetails)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    // Watch Slug on Change
    const categoryName = form.watch('name')
    useEffect(() => {
        if (categoryName) {
            const slug = slugify(categoryName, { lower: true })
            form.setValue('slug', slug)
        }
    }, [categoryName])

    useEffect(() => {
        if (categoryData) {
            form.setValue('name', categoryData.category.name)
            form.setValue('slug', categoryData.category.slug)
        }
    }, [categoryData])

    if (loading) return <Loading />

    return (
        <div>
            <Card className="pt-5 max-w-screen-md mx-auto">
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}  >
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>
    )
}

export default EditGategory