console.log("Environment variables:", import.meta.env);

const apiPrefix = import.meta.env.VITE_EHUB_BACKEND_URL || "";
const apiPrefixBC = import.meta.env.VITE_EHUB_BC_URL || "";

console.log("apiPrefix:", apiPrefix);
console.log("apiPrefixBC:", apiPrefixBC);

export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  apiPrefixBC: string;
};

const appConfig: AppConfig = {
  apiPrefix,
  authenticatedEntryPath: "/dashboard",
  unAuthenticatedEntryPath: "/single-sign-on",
  apiPrefixBC,
};

export default appConfig;
