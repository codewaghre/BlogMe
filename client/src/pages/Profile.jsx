import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading'

import Dropzone from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'


import { IoCameraOutline } from "react-icons/io5";
import { getEnv } from '@/helper/GetEnv'
import { showToast } from '@/helper/ShowToast'
import { useFetch } from '@/hooks/useFetch'


import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setUser } from '@/app/features/user.feature'




function Profile() {

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    // console.log("user UseSelfector Profile", user);

    const [filePreview, setFilePreview] = useState()
    const [file, setFile] = useState()


    const { data: userData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/user/get-user/${user?.user?._id}`, { method: 'get', credentials: 'include' },)
    // console.log("Data", userData);



    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 character long.'),
        email: z.string().email(),
        bio: z.string().min(3, 'Bio must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            bio: '',
        },
    })

    useEffect(() => {
        if (userData && userData?.success) {
            form.reset({
                name: userData?.user?.name,
                email: userData?.user?.email,
                bio: userData?.user?.bio,
            })
        }
    }, [userData])

    const handleProfile = (files) => {
        // console.log(accesptefFile);
        const file = files[0]

        const preview = URL.createObjectURL(file)
        console.log("preview", preview);

        setFilePreview(preview)
        setFile(file)
    }

    const onSubmit = async (values) => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('data', JSON.stringify(values))

            console.log("check form Data todo", formData);

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/user/update-user/${userData?.user?._id}`, {
                method: 'put',
                credentials: 'include',
                body: formData
            })
            const data = await response.json()

            if (!response.ok) {
                return showToast('error', data.message)
            }
            dispatch(setUser(data.user))
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }


    const imageSrc = userData?.user?.avatar || 'https://github.com/shadcn.png'

    if (loading) return <Loading />
    return (
        <Card className="max-w-screen-md mx-auto ">
            <div className='bg-[#f9fbf8] flex items-center justify-center p-5'>
                <h3 className='font-bold text-3xl'>Profile Details</h3>
            </div>
            <CardContent>

                <Dropzone onDrop={acceptedFiles => handleProfile(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className='flex justify-center items-center mt-10' >
                                    <Avatar>
                                        <AvatarImage src={filePreview ? filePreview : imageSrc} />
                                    </Avatar>
                                </div>

                                <div className='flex justify-center items-center  p-2 text-center group-hover:flex  cursor-pointer '>
                                    <IoCameraOutline color='#000000' />- Uplaod Profile
                                </div>
                            </div>
                        </section>
                    )}
                </Dropzone>

                {/* Name Field */}
                <div>
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

                            {/* Email Field */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    readOnly
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input readOnly className="opacity-75 cursor-not-allowed" placeholder="Enter your email address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Bio Field */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea type="password" placeholder="Enter bio" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">Save Changes</Button>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

export default Profile