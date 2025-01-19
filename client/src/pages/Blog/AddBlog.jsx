import React, { useEffect, useState } from 'react'
import Editor from '@/components/Editor'

import slugify from 'slugify'
import Dropzone from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import Loading from '@/components/Loading'

import { getEnv } from '@/helper/GetEnv'
import { showToast } from '@/helper/ShowToast'
import { RouteBlog } from '@/helper/RouteName'

import { useFetch } from '@/hooks/useFetch'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useSelector } from 'react-redux'


function AddBlog() {


    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()

    // Fetch :- All Category List using useFetch
    const { data: categoryData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
        method: 'get',
        credentials: 'include'
    })

    const formSchema = z.object({
        category: z.string().min(3, 'Category must be at least 3 character long.'),
        title: z.string().min(3, 'Title must be at least 3 character long.'),
        slug: z.string().min(3, 'Slug must be at least 3 character long.'),
        blogContent: z.string().min(3, 'Blog content must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    })

    const handleEditorData = (event, editor) => {
        const data = editor.getData()
        form.setValue('blogContent', data)
    }

    const blogTitle = form.watch('title')

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true })
            form.setValue('slug', slug)
        }
    }, [blogTitle])

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        console.log("Preview", preview);

        setFile(file)
        setPreview(preview)
    }


    //  Fetch :- Add Blog API
    async function onSubmit(values) {

        // console.log("check add blog categioes value", values);
        try {

            const newvalue = { ...values, author: user.user._id }
            console.log(newvalue);

            if (!file) {
                showToast("error", 'Feature image required.')
            }

            //* FormData is react-hook-form feature to append values in form key and value pair
            const formData = new FormData()
            formData.append("file", file)
            formData.append("data", JSON.stringify(newvalue))


            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog/add`, {
                method: 'post',
                credentials: 'include',
                body: formData
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            form.reset()
            navigate(RouteBlog)
            showToast('success', data.message)
            setFile()
            setPreview()
        } catch (error) {
            showToast('error', error.message)
        }
    }

    if (loading) return <Loading />
    return (
        <div>
            <Card className="pt-5 " >
                <CardContent>
                    <h1 className='text-2xl font-bold mb-4'>Edit Blog</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>

                            {/* Category List */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (

                                        <FormItem>
                                            <FormLabel className='mb-2 block font-bold text-base'>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger  >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoryData && categoryData.category.length > 0 &&
                                                            categoryData.category.map(category => <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>)
                                                        }
                                                    </SelectContent>
                                                </Select>

                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Title  */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='mb-2 block font-bold text-base'>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter blog title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Slug */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='mb-2 block font-bold text-base'>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Featured Image */}
                            <div className='mb-3'>
                                <span className='mb-2 block font-bold text-base'>Featured Image</span>
                                <div className='bg-[#fafdf9] h-[400px] w-[400px] overflow-hidden flex justify-center items-center'> {/* Set height and width */}
                                    <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()} className='h-full w-full'>
                                                <input {...getInputProps()} />
                                                <div className='flex justify-center items-center h-full w-full border-2 border-dashed rounded'>
                                                    {filePreview ? (
                                                        <img
                                                            src={filePreview}
                                                            alt='Preview'
                                                            className='max-h-full max-w-full object-contain'
                                                        />
                                                    ) : (
                                                        <span className='text-white'>Drag & drop or click to upload</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Dropzone>
                                </div>
                            </div>

                            {/* Blog Content */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="blogContent"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel className='mb-2 block font-bold text-base'>Blog Content</FormLabel>
                                            <FormControl>
                                                <div >
                                                    <Editor
                                                        props={{
                                                            initialData: '',
                                                            onChange: handleEditorData,
                                                        }}
                                                    />
                                                </div>
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

export default AddBlog