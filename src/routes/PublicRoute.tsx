import {Navigate, Outlet} from "react-router-dom";
import appConfig from "../configs/navigation.config/app.config.ts";
import useAuth from "../utils/hooks/useAuth.ts";
const  {authenticatedEntryPath } = appConfig
const PublicRoute = () =>{

    const { authenticated } = useAuth()


    return authenticated ? <Navigate to={authenticatedEntryPath}/> : <Outlet />

}

export default PublicRoute