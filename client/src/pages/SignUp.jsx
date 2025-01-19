import React from 'react'
import logo from '@/assets/images/logo.png'
import GoogleLogin from '@/components/GoogleLogin'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { RouteAdminDetails, RouteIndex, RouteSignIn } from '@/helper/RouteName'
import { showToast } from '@/helper/ShowToast'
import { getEnv } from '@/helper/GetEnv'

import { IoMdArrowRoundBack } from "react-icons/io";



function SignUp() {

    const navigate = useNavigate()

    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 character long.'),
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 character long'),
        confirmPassword: z.string().refine(data => data.password === data.confirmPassword, 'Password and confirm password should be same.')
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    async function onSubmit(values) {
        // console.log("Sign Up Form Data:- ", values);

        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/register`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values)
            })
            const data = await response.json()
            if (!response.ok) {
                // console.log("error", data.message);
                showToast("error", data.message)
            }

            navigate(RouteAdminDetails)
            showToast("success", data.message)

        } catch (error) {
            // console.log("error using SignUp Route", error);
            showToast("error", error.message)
        }
    }

    return (
        <div className='flex justify-center items-center h-screen w-screen'>
            <Card className='w-[400px] p-5'>

                <div >
                    <Link className='flex gap-2 items-center' to={RouteIndex} >
                        <h4 >Back </h4>
                        <IoMdArrowRoundBack />
                    </Link>
                </div>

                <div className='flex justify-center items-center mb-5 '>
                    <Link to={RouteIndex}>
                        <img src={logo} className='w-40' />
                    </Link>
                </div>
                <h1 className='text-2xl font-bold text-center mb-5'>Register Account</h1>
                <div>
                    <GoogleLogin />
                    <div className='border my-5 flex justify-center items-center'>
                        <span className='absolute bg-white text-sm'>Or</span>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Form Name  */}
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

                        {/* Form Email */}
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Form Password */}
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Form Confirm Password */}
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter  password again" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Form Button */}
                        <div className='mt-5'>
                            <Button type="submit" className='w-full'>SignIn</Button>
                            <div className='mt-5 text-sm flex justify-center items-center gap-2'>
                                <p>Already have account?</p>
                                <Link className='text-blue-500 hover:underline' to={RouteSignIn}>Sign In</Link>
                            </div>
                        </div>

                    </form>
                </Form>
            </Card>

        </div>
    )
}

export default SignUp