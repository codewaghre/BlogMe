import { BrowserRouter, Route, Routes } from "react-router-dom"

import Layout from "./layout/Layout"
import Index from "./pages"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import ChangePassword from "./pages/ChangePassword"

import { RouteAddCategory, RouteAdminDetails, RouteBlog, RouteBlogAdd, RouteBlogByCategory, RouteBlogDetails, RouteBlogEdit, RouteCategoryDetails, RouteChangePassword, RouteCommentDetails, RouteEditCategory, RouteIndex, RouteProfile, RouteSearch, RouteSignIn, RouteSignUp, RouteUser, RouteAddAdmin } from "./helper/RouteName"

import AddGategory from "./pages/Gategory/AddGategory"
import GategoryDetails from "./pages/Gategory/GategoryDetails"
import EditGategory from "./pages/Gategory/EditGategory"

import AddBlog from "./pages/Blog/AddBlog"
import BlogDetails from "./pages/Blog/BlogDetails"
import EditBlog from "./pages/Blog/EditBlog"
import Error from "./components/Error"
import SingleBlogPage from "./pages/SingleBlogPage"
import BlogByCategory from "./pages/Blog/BlogByCategory"
import SearchResult from "./pages/SearchResult"
import Comments from "./pages/Comments/Comments"
import User from "./pages/User"

import Authenticate from "./helper/Authenticate"
import AdminRoute from "./helper/AdminRoute"
import AddAdmin from "./pages/Admin/AddAdmin"
import AdminDetails from "./pages/Admin/AdminDetails"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={RouteIndex} element={<Layout />} >




            <Route index element={<Index />} />
            <Route path={RouteBlogByCategory()} element={<BlogByCategory />} />
            <Route path={RouteSearch()} element={<SearchResult />} />

            <Route element={<Authenticate />}>
              {/* User Profile Routes */}
              <Route path={RouteProfile} element={<Profile />} />
              <Route path={RouteChangePassword} element={<ChangePassword />} />
              {/* Blog Routes */}
              <Route path={RouteBlog} element={<BlogDetails />} />
              <Route path={RouteBlogAdd} element={<AddBlog />} />
              <Route path={RouteBlogEdit()} element={<EditBlog />} />
              <Route path={RouteBlogDetails()} element={<SingleBlogPage />} />
              <Route path={RouteCommentDetails} element={<Comments />} />
            </Route>

            <Route element={<AdminRoute />}>
              {/* Cateogry Routes */}
              <Route path={RouteCategoryDetails} element={<GategoryDetails />} />
              <Route path={RouteAddCategory} element={<AddGategory />} />
              <Route path={RouteEditCategory()} element={<EditGategory />} />
              <Route path={RouteUser} element={<User />} />
              <Route path={RouteAdminDetails} element={<AdminDetails />} />
            </Route>
          </Route>

          {/* Auth Routes*/}
          <Route path={RouteSignIn} element={<SignIn />} />
          <Route path={RouteSignUp} element={<SignUp />} />
          <Route path={RouteAddAdmin} element={<AddAdmin />} />


          <Route path="*" element={<Error />} />



        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
