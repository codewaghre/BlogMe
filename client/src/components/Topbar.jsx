import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '@/assets/images/logo.png'

import SearchBox from './SearchBox';

import { IoMdSearch } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { IoLogOutOutline, IoSearch } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { removeUser } from '@/app/features/user.feature';

import { RouteProfile, RouteIndex, RouteChangePassword, RouteSignIn } from '@/helper/RouteName';
import { showToast } from '@/helper/ShowToast';
import { getEnv } from '@/helper/GetEnv';

import { useSidebar } from './ui/sidebar';



function Topbar() {

    const user = useSelector(state => state.user)
    // console.log("user Redux", user);

    const { toggleSidebar } = useSidebar()
    const [showSearch, setShowSearch] = useState(false)

    const dispath = useDispatch()
    const navigate = useNavigate()

    const imageSrc = user?.user?.avatar ? user?.user?.avatar : 'https://github.com/shadcn.png'  //

    //fetch :- Logout
    const handleLogout = async () => {

        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/logout`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
            })
            const data = await response.json()

            if (!response.ok) {
                return showToast('error', data.message)
            }

            dispath(removeUser())
            navigate(RouteIndex)
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    const toggleSearch = () => {
        setShowSearch(!showSearch)
    }


    return (
        <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white p-10  px-5 pl-11 border-b' >

            {/* logo hand Hamburger Menu */}
            <div className='flex justify-center items-center gap-2'>
                <button onClick={toggleSidebar} className='md:hidden' type='button'>
                    <AiOutlineMenu />
                </button>

                <Link to={RouteIndex}>
                    <img src={logo} alt='logo' className='w-[120px] min-w-[80px]  md:block' />
                </Link>
            </div>

            {/* Search box */}
            <div className='w-[500px]'>
                <div className={`md:relative md:block absolute bg-white left-0 w-full md:top-0 top-16 md:p-0 p-5 ${showSearch ? 'block' : 'hidden'}`}>
                    <SearchBox />
                </div>
            </div>

            <div className='flex items-center gap-5'>
                <button onClick={toggleSearch} type='button' className='md:hidden block'>
                    <IoMdSearch size={25} />
                </button>


                {/* Auth Buttons :- login , Register, Profile etc */}
                {!user.isLoggedIn ? <div>
                    <Button asChild>
                        <Link to={RouteSignIn} className='rounded-full'>
                            <MdLogin />
                            Sign-In
                        </Link>
                    </Button>
                </div>
                    : <DropdownMenu>

                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={imageSrc} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                <p>{user?.user?.name}</p>
                                <p className='text-sm'>{user?.user?.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to={RouteProfile}>
                                    <FaRegUser />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="">
                                    <FaPlus />
                                    Create Blog
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                asChild
                                className={`cursor-pointer ${user?.user?.googleEmail ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={!!user?.user?.googleEmail}
                            >

                                <Link to={RouteChangePassword}>
                                    <RiLockPasswordFill />
                                    Change Password
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                <IoLogOutOutline color='red' />
                                Logout
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                }

            </div>
        </div >
    )
}

export default Topbar