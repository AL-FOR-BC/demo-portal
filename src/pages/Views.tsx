import { Navigate, Route, Routes } from "react-router-dom";
import { protectedRoutes, publicRoutes } from "../routes/routes.configs/routes.config.ts";
import PublicRoute from "../routes/PublicRoute.tsx";
import { Suspense } from "react";
import AppRoute from "../routes/AppRoute.tsx";
import appConfig from "../configs/navigation.config/app.config.ts";
import ProtectedRoute from "../routes/ProtectedRoute.tsx";
import Loader from "../Components/Loader.tsx";

const AllRoutes = () => {
    const { authenticatedEntryPath } = appConfig

    return (
        <Routes>

            <Route path="/" element={<ProtectedRoute />}>
                <Route
                    path="/"
                    element={<Navigate replace to={authenticatedEntryPath} />}
                />

                {protectedRoutes.map((route) => (
                    <Route
                        key={route.key}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                            />}
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>

            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.key}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                            />
                        }

                    />
                ))}
            </Route>
            {/* Global Wildcard Route */}
            <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
    )
}


const Views = () => {
    return (
        <Suspense fallback={<Loader />}>
            <AllRoutes />
        </Suspense>
    )
}
export default Views