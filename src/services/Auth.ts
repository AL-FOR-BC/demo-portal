import {BcToken, SignInCredential, SignInResponse, SignUpCredential, SignUpResponse} from "../@types/auth.dto.ts";
import ApiService from "./ApiServices.ts";

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/api/user/register',
        method: 'post',
        data,
    })
}
export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchData<SignInResponse>({
        url: '/api/user/login',
        method: 'post',
        data,
    })
}

export async function apiBcToken() {
    return ApiService.fetchData<BcToken>({
        url: '/api/token',
        method:'get',

    })
}
