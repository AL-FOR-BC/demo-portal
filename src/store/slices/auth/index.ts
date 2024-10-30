import {combineReducers} from "redux";
import user ,{UserState} from "./userSlice"
import session,{SessionState} from "./sessionSlice"

export type AuthState= {
    user:UserState,
    session:SessionState,
}
const reducer = combineReducers({
    user,
    session
})

export * from "./userSlice"
export * from  "./sessionSlice"

export default reducer;