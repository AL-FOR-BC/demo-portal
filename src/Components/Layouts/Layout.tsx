import useAuth from "../../utils/hooks/useAuth.ts";
import {lazy, Suspense, useEffect, useMemo} from "react";
import {useAppSelector} from "../../store/hook.ts";
import Loader from "../Loader.tsx";

const LayoutWrapper = () => {
    const {topBar,layoutName} = useAppSelector((state) => state.layout);

    useEffect(() => {
        document.body.setAttribute('data-layout', layoutName);
        document.body.setAttribute('data-topbar', topBar);
    }, [topBar, layoutName]);

    return null;
};
function Layout() {
    const { authenticated } = useAuth ()
    const AppLayout = useMemo(() => {
        if (authenticated) {
           return lazy(() => import('./HorizontalLayout/HorizontalLayout'))
        }
        return lazy(() => import('./AuthLayout'))

    }, [authenticated])

    return (
        <>
            <LayoutWrapper />
            <Suspense fallback={<Loader />}>
                <AppLayout />
            </Suspense>
        </>

    );
}

export default Layout;