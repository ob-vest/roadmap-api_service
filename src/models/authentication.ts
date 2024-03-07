export interface IAppleSignInResponse {
  expires_in: number;
  id_token: string;
  refresh_token: string;
  sub: string;
}

interface DecodedToken {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  at_hash: string;
  auth_time: number;
  nonce_supported: boolean;
}
