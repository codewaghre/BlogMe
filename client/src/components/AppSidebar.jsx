import React from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Link, useNavigate } from 'react-router-dom'

import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";
import { GoDot } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { IoLogOutOutline, IoSearch } from "react-icons/io5";

import logo from '@/assets/images/logo.png'
import { RouteAdminDetails, RouteBlog, RouteBlogByCategory, RouteCategoryDetails, RouteCommentDetails, RouteIndex, RouteProfile, RouteUser } from '@/helper/RouteName';
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helper/GetEnv';
import { showToast } from '@/helper/ShowToast';

import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '@/app/features/user.feature';





function AppSidebar() {

    const user = useSelector(state => state.user)
    const dispath = useDispatch()
    const navigate = useNavigate()

    // Fetch :- list of all Category
    const { data: categoryData } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
        method: 'get',
        credentials: 'include'
    })

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


    return (
        <>
            <Sidebar>
                <SidebarHeader className='pl-11'>
                    <img src={logo} alt='logo' width={120} />
                </SidebarHeader>

                {/* Main Sidebar Content */}
                <SidebarContent className="bg-white">

                    <SidebarGroup>

                        {/* Side Menu One */}
                        <SidebarMenu>
                            {/* Home */}
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <IoHomeOutline />
                                    <Link to={RouteIndex}>
                                        Home
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Blog */}
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <GrBlog />
                                    <Link to={RouteBlog}>
                                        Blogs
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Comments */}
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <FaRegComments />
                                    <Link to={RouteCommentDetails} >Comments</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>


                            {/* Gatergories */}

                            {user && user.isLoggedIn && user.user.role === "admin" ? <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <BiCategoryAlt />
                                        <Link to={RouteCategoryDetails}>
                                            Categories
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* users */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <LuUsers />
                                        <Link to={RouteUser}>Users</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <LuUsers />
                                        <Link to={RouteAdminDetails}>Add Admin</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                            </> : <> </>}

                        </SidebarMenu>

                        {/* SideBar menu Two */}
                        <SidebarMenu>
                            <SidebarGroupLabel>
                                Categories
                            </SidebarGroupLabel>
                            {categoryData && categoryData?.category.length > 0 ?
                                categoryData?.category?.map(category =>
                                    <SidebarMenuItem key={category._id}>
                                        <SidebarMenuButton>
                                            <GoDot />
                                            <Link to={RouteBlogByCategory(category.slug)} >{category.name}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ) :
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <GoDot />
                                        <Link to={RouteIndex}>
                                            Empty list
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            }
                        </SidebarMenu>

                    </SidebarGroup>
                </SidebarContent>


                {user && user.isLoggedIn === 'true' ? <>
                    <SidebarGroup className="sticky bottom-0 bg-white border-t border-gray-200">
                        <SidebarMenu>
                            {/* Profile */}
                            <SidebarMenuItem>
                                <SidebarMenuButton className="cursor-pointer">
                                    <FaRegUser />
                                    <Link to={RouteProfile} >Profile</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Logout */}
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <IoLogOutOutline color='red' className="cursor-pointer" />
                                    <Link onClick={handleLogout}>
                                        Logout
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </> : <></>}



            </Sidebar>
        </>
    )
}

export default AppSidebar