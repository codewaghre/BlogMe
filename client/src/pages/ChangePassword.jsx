import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { showToast } from '@/helper/ShowToast'
import { getEnv } from '@/helper/GetEnv'





function ChangePassword() {
    const formSchema = z.object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z.string().min(8, 'Password must be at least 8 character long'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
        },
    })

    const onSubmit = async (values) => {
        // console.log("password Filed Values", values);



        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/reset-password`, {
                method: 'put',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values)
            })

            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            showToast('success', data.message)

        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <Card className="max-w-screen-md mx-auto ">
            <div className='bg-[#f9fbf8] flex items-center justify-center p-5'>
                <h3 className='font-bold text-3xl'>Change your Password</h3>
            </div>
            <CardContent>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}  >

                            {/* Form Password */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Old Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter old your password" {...field} />
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
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter new password again" {...field} />
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

export default ChangePassword