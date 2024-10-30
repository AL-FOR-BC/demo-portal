

import {Routes} from "../../@types/routes.dto.ts";
import authRoutes from  "../routes.configs/authRoutes.tsx"
import appRoutes from "./appRoutes.tsx";

export const publicRoutes: Routes = [
    ...authRoutes
]
export const protectedRoutes: Routes = [
    ...appRoutes
]