import axios from "axios";
import appConfig from "../configs/navigation.config/app.config.ts";
import { PERSIST_STORE_NAME } from "../constants/app.constants.ts";
import store from "../store/storeSetup.ts";
import deepParseJson from "../utils/deepParseJson.ts";
import {
  REQUEST_HEADER_AUTH_KEY,
  TOKEN_TYPE,
} from "../constants/api.constants.ts";
import { signOutSuccess } from "../store/slices/auth";

const unauthorizedCode = [401];

const BcBaseService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiPrefixBC,
});

BcBaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
    const persistData = deepParseJson(rawPersistData);
    console.log("persistData", persistData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (persistData) {
      let accessToken = (persistData as any).auth.session.bcToken;

      if (!accessToken) {
        const { auth } = store.getState();
        accessToken = auth.session.token;
      }

      if (accessToken) {
        config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`;
      }
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BcBaseService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    console.log("response", response);

    if (response && unauthorizedCode.includes(response.status)) {
      store.dispatch(signOutSuccess());
    }

    return Promise.reject(error);
  }
);

export default BcBaseService;
