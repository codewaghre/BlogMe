import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

import { signInWithPopup } from 'firebase/auth'

import { showToast } from '@/helper/ShowToast'
import { auth, provider } from '@/helper/Firebase'
import { RouteIndex } from '@/helper/RouteName'
import { getEnv } from '@/helper/GetEnv'

import { FcGoogle } from "react-icons/fc";

import { useDispatch } from 'react-redux'
import { setUser } from '@/app/features/user.feature'



function GoogleLogin() {

    const navigate = useNavigate()
    const dispath = useDispatch()

    const handleLogin = async () => {
        try {

            const googleResponse = await signInWithPopup(auth, provider)
            console.log("google Response", googleResponse);

            const user = googleResponse.user
            const googleData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            }

            // console.log("googleData", googleData);
            // console.log("googleData striglyc", JSON.stringify(googleData));



            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/google`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(googleData)
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }

            navigate(RouteIndex)
            showToast('success', data.message)
            dispath(setUser(data.user))

        } catch (error) {
            showToast('error', error.message)
        }
    }
    return (
        <>
            <Button variant="outline" className="w-full mb-3" onClick={handleLogin} >
                <FcGoogle />
                Continue With Google
            </Button>
        </>
    )
}

export default GoogleLogin