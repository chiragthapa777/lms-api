export interface IGetKeyData {
  module: string;
  feature: string;
  identifier: string | number;
}

export interface ISetKeyOptions {
  expirationSeconds?: number;
}
