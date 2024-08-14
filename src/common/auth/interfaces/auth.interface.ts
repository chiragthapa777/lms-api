// Auth
export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpired: Date;
  passwordCreated: Date;
}

export interface IAuthRefreshTokenOptions {
  // in milliseconds
  notBeforeExpirationTime?: number | string;
}

export interface IAuthGooglePayload {
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

export interface IHelperJwtVerifyOptions {
  audience: string;
  issuer: string;
  subject: string;
  secretKey: string;
}

export interface IHelperJwtOptions extends IHelperJwtVerifyOptions {
  expiredIn: number | string;
  notBefore?: number | string;
}
