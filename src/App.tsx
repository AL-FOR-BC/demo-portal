import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/storeSetup.ts";
import Layout from "./Components/Layouts/Layout.tsx";
import { ToastContainer } from "react-toastify";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, LogLevel } from "@azure/msal-browser";
import { AuthenticationResult } from "@azure/msal-browser";

const pca = new PublicClientApplication({
  auth: {
    clientId: "2d426493-7077-4eff-bace-cadbbed558bd",
    authority: "https://login.microsoftonline.com/df78e20f-3ca1-4018-9157-8bedb2673da2",
    redirectUri: window.location.origin + "/rom/",
    postLogoutRedirectUri: window.location.origin + "/rom/single-sign-on/",
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true
  },
  system: {
    allowNativeBroker: false,
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    loggerOptions: {
      loggerCallback: ( message, ) => {
        console.log(message);
      },
      logLevel: LogLevel.Error
    }
  }
});

pca.initialize().catch(error => {
  console.error("MSAL Initialization Error:", error);
  localStorage.clear();
  sessionStorage.clear();
});

pca.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    if (payload.account) {
      pca.setActiveAccount(payload.account);
    }
  }
});

function App() {

  return (

    <Provider store={store}>
      <MsalProvider instance={pca}>
        <BrowserRouter basename="/rom">
          <ToastContainer
            theme="colored"
          />
          <Layout />

        </BrowserRouter>
      </MsalProvider>
    </Provider>
  )
}

export default App
