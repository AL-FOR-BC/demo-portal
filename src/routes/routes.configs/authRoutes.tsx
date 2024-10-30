
import {Routes} from "../../@types/routes.dto.ts";
import {lazy} from "react";

const authRoutes:Routes = [
    {
        key: "login",
        path: "/login",
        component:lazy(()=> import('../../pages/authentication/Login')),
    },
    {
        key:'register',
        path:"/register",
        component:lazy(()=>import('../../pages/authentication/Register')),
    },
    {
        key:'single-sign-on',
        path:'/single-sign-on',
        component:lazy(()=>import('../../pages/authentication/SingleSignOn')),
    }

    // Additional routes can be defined here
    // { key: "logout", path: "/logout", component: <Logout /> },
    // { key: "pages404", path: "/pages-404", component: <Pages404 /> },
    // { key: "pages500", path: "/pages-500", component: <Pages500 /> },
];

export default authRoutes;