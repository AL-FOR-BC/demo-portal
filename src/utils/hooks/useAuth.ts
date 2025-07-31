import { useAppDispatch, useAppSelector } from "../../store/hook.ts";
import { SignInCredential, SignUpCredential } from "../../@types/auth.dto.ts";
import { apiBcToken, apiSignIn, apiSignUp } from "../../services/Auth.ts";
import {
  bcTokenSuccess,
  setAdmin,
  setUser,
  signInSuccess,
  signOutSuccess,
} from "../../store/slices/auth";
import { REDIRECT_URL_KEY } from "../../constants/app.constants.ts";
import useQuery from "./useQuery";
import { useNavigate } from "react-router-dom";
import appConfig from "../../configs/navigation.config/app.config.ts";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError, AccountInfo } from "@azure/msal-browser";
import { lowercaseOrganizationEmail } from "../common.ts";

function UseAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const query = useQuery();
  const { instance } = useMsal();

  const { token, signedIn } = useAppSelector((state) => state.auth.session);
  const signUp = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUp(values);
      console.log(resp);
      if (resp.data) {
        dispatch(
          setUser(
            resp.data || {
              email: "",
            }
          )
        );
      }
      return {
        status: "success",
        message: resp.data.msg,
      };
    } catch (error) {
      console.log(error);

      return {
        status: "failed",
        // @ts-ignore
        message: error?.response?.data?.msg || error.toString(),
      };
    }
  };
  const getToken = async () => {
    try {
      const resp = await apiBcToken();
      const { access_token } = resp.data;
      if (access_token) {
        dispatch(signInSuccess(access_token));
        return {
          status: "success",
        };
      }
    } catch (error) {
      return {
        status: "failed",
        // @ts-ignore
        message: error?.response?.data?.msg || error.toString(),
      };
    }
  };

  const signIn = async (values: SignInCredential) => {
    try {
      const signInResponse = await apiSignIn(values);
      const { token, email, verified, isAdmin } = signInResponse.data;
      console.log(signInResponse.data);
      if (token) {
        const bcTokenResponse = await apiBcToken();
        const { access_token } = bcTokenResponse.data;
        if (access_token) {
          const bcToken = access_token;
          dispatch(signInSuccess(token));
          dispatch(bcTokenSuccess(bcToken));
          dispatch(
            setUser(
              email ? { email, verified } : { email: "", verified: false }
            )
          );
          dispatch(setAdmin(isAdmin));
        }
      }
      const redirectUrl = query.get(REDIRECT_URL_KEY);
      navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
      return {
        status: "success",
        message: signInResponse.data.msg,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "failed",
        // @ts-ignore
        message: error?.response?.data?.msg || error.toString(),
      };
    }
  };

  const getAzureTokenAndAccount = async (): Promise<{
    token: string | undefined;
    account: AccountInfo | null;
  }> => {
    const request = {
      scopes: ["https://api.businesscentral.dynamics.com/.default"],
      extraScopesToConsent: [
        "user.read",
        "openid",
        "profile",
        "offline_access",
      ],
    };

    try {
      const response = await instance.acquireTokenSilent(request);
      return { token: response.accessToken, account: response.account };
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await instance.acquireTokenPopup(request);
        return { token: response.accessToken, account: response.account };
      } else {
        return { token: undefined, account: null };
      }
    }
  };

  const signInWithAzure = async () => {
    try {
      const { token, account } = await getAzureTokenAndAccount();
      if (token && account) {
        const bcTokenResponse = await apiBcToken();
        const { access_token } = bcTokenResponse.data;
        if (access_token) {
          dispatch(signInSuccess(token));
          dispatch(bcTokenSuccess(access_token));
          const userEmail = account.username;
          const email = lowercaseOrganizationEmail(userEmail);
          dispatch(setUser({ email, verified: true }));
          console.log("User email:", email);
          return {
            status: "success",
            message: "Signed in with Azure successfully",
          };
        }
      }
      return { status: "failed", message: "Failed to get token or account" };
    } catch (error: any) {
      return { status: "failed", message: error.toString() };
    }
  };
  const handleSignOut = async () => {
    // if (token) {
    //   const azureToken = jwtDecode(token);
    //   if (
    //     typeof azureToken === "object" &&
    //     "aud" in azureToken &&
    //     azureToken.aud === "https://api.businesscentral.dynamics.com"
    //   ) {
    //     handleSignOutAzure();
    //     dispatch(signOutSuccess());
    //     dispatch(
    //       setUser({
    //         email: "",
    //         verified: false,
    //       })
    //     );
    //   } else {
    //     dispatch(signOutSuccess());
    //     dispatch(
    //       setUser({
    //         email: "",
    //         verified: false,
    //       })
    //     );
    //   }
    // }
    dispatch(signOutSuccess());
    dispatch(
      setUser({
        email: "",
        verified: false,
      })
    );

    // navigate(appConfig.unAuthenticatedEntryPath);
  };
  const handleSignOutAzure = () => {
    instance.logoutRedirect();
  };

  const signOut = async () => {
    handleSignOut();
  };

  return {
    authenticated: token && signedIn,
    signUp,
    signIn,
    signInWithAzure,
    getToken,
    signOut,
    handleSignOutAzure,
  };
}

export default UseAuth;
