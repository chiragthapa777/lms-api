export enum USER_TYPE {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
}
export interface IUser {

}

export interface IUserNameJson {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
}

export enum USER_GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}
