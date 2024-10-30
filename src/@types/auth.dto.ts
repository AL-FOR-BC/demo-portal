export type SignInCredential = {
  email: string;
  password: string;
};

export type SignInResponse = {
  token: string;
  email: string;
  msg: string;
  verified: boolean;
  isAdmin: boolean;
};

export type SignUpResponse = SignInResponse;

export type SignUpCredential = {
  email: string;
  password: string;
};

export type ForgotPassword = {
  email: string;
};

export type ResetPassword = {
  password: string;
};

export type BcToken = {
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
};
export interface AzureADToken {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  amr: string[];
  appid: string;
  appidacr: string;
  family_name: string;
  given_name: string;
  ipaddr: string;
  name: string;
  oid: string;
  rh: string;
  scp: string;
  sub: string;
  tid: string;
  unique_name: string;
  upn: string;
  uti: string;
  ver: string;
}
