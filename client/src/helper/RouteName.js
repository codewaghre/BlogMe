// Index Route
export const RouteIndex = '/'

// Auth Route
export const RouteSignIn = '/sign-in'
export const RouteSignUp = '/sign-up'
export const RouteProfile = '/profile'
export const RouteChangePassword = '/chnage-password'

// Categroy Routes
export const RouteCategoryDetails = '/categories'
export const RouteAddCategory = '/category/add'
export const RouteEditCategory = (category_id) => {
    if (category_id) {
        return `/category/edit/${category_id}`
    } else {
        return `/category/edit/:category_id`
    }
}

//  Blog Routes
export const RouteBlog = '/blog'
export const RouteBlogAdd = '/blog/add'
export const RouteBlogEdit = (blogid) => {
    if (blogid) {
        return `/blog/edit/${blogid}`
    } else {
        return `/blog/edit/:blogid`
    }
}

//Route blog Detils 
export const RouteBlogDetails = (category, blog) => {
    if (!category || !blog) {
        return '/blog/:category/:blog'
    } else {
        return `/blog/${category}/${blog}`
    }
}

// get blog by Category
export const RouteBlogByCategory = (category) => {
    if (!category) {
        return '/blog/:category'
    } else {
        return `/blog/${category}`
    }
}


//search 
export const RouteSearch = (q) => {
    if (q) {
        return `/search?q=${q}`
    } else {
        return `/search`
    }
}



//Comment section
export const RouteCommentDetails = '/comments'
export const RouteUser = '/users'

export const RouteAddAdmin = '/admin'
export const RouteAdminDetails = '/admin/details'
