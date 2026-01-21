import axios from "axios";
import appConfig from "../configs/navigation.config/app.config";
import { PERSIST_STORE_NAME } from "../constants/app.constants";
import store from "../store/storeSetup";
import deepParseJson from "../utils/deepParseJson";
import { REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from "../constants/api.constants";

const unauthorizedCode = [401];

// Helper function to determine API URL based on environment
const getApiUrl = () => {
    if (appConfig.environment === 'production') {
        // Use relative URL in production
        // ${window.location.origin} ${window.location.origin} 
        return `https://selfservicebackend.reachoutmbuya.org/`;
    }
    return appConfig.apiPrefix;
};

const BaseService = axios.create({
    timeout: 60000,
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

BaseService.interceptors.request.use(
    (config) => {
        const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
        const persistData = deepParseJson(rawPersistData)
        console.log("persistData",persistData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let accessToken = (persistData as any).auth.session.token

        if (!accessToken) {
            const { auth } = store.getState()
            accessToken = auth.session.token
        }

        if (accessToken) {
            config.headers[
                REQUEST_HEADER_AUTH_KEY
                ] = `${TOKEN_TYPE}${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

BaseService.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response && unauthorizedCode.includes(response.status)) {
            // store.dispatch(signOutSuccess());
        }

        return Promise.reject(error);
    }
);

export default BaseService;
