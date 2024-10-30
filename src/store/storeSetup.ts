import  {
    configureStore,
    Action,
    Reducer,
    AnyAction,
    Store
} from "@reduxjs/toolkit";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"
import rootReducer, {AsyncReducers, RootState} from "./rootReducer.ts";
import RtkQueryService from "../services/RtkQueryService.ts";
import {PERSIST_STORE_NAME} from "../constants/app.constants.ts";


interface CustomStore extends Store<RootState, AnyAction>{
    asyncReducers?:AsyncReducers
}

const middlewares:any[] =  [RtkQueryService.middleware];


const persistConfig = {
    key:PERSIST_STORE_NAME,
    storage,
    keyPrefix: '',
    whitelist: ['auth'],
}

const store: CustomStore = configureStore({
    reducer: persistReducer(persistConfig, rootReducer() as Reducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(middlewares),
});
store.asyncReducers = {}




const persistor = persistStore(store);


export function injectReducer<S>(key: string, reducer: Reducer<S, Action>) {
    if (store.asyncReducers) {
        if (store.asyncReducers[key]) {
            return false
        }
        store.asyncReducers[key] = reducer
        store.replaceReducer(
            persistReducer(
                persistConfig,
                rootReducer(store.asyncReducers) as Reducer
            )
        )
    }
    persistor.persist()
    return store
}

export type AppDispatch = typeof store.dispatch

export { persistor }

export default store
