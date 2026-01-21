import { Navigate, Outlet, useLocation } from "react-router-dom"
import { REDIRECT_URL_KEY } from "../constants/app.constants"
import appConfig from "../configs/navigation.config/app.config"
import UseAuth from "../utils/hooks/useAuth"
import { isSystemConfigSessionActive } from "../features/auth/utils/systemConfigAuth"

const ProtectedRoute = () => {
    const { authenticated } = UseAuth()
    const { unAuthenticatedEntryPath } = appConfig

    const location = useLocation()

    const isSystemConfigRoute = location.pathname.startsWith("/system-config")

    if (!authenticated && (!isSystemConfigRoute || !isSystemConfigSessionActive())) {
        return <Navigate replace to={`${unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${location.pathname}`} />
    }


    return <Outlet />

}

export default ProtectedRoute







