// export interface User {
//   firstName: string;
//   lastName: string;
//   id: string;
//   userName: string;
//   email: string;
//   emailConfirmed: boolean;
//   phoneNumber: string;
//   twoFactorEnabled: boolean;
// }

export class User {
  constructor(
   public firstName: string,
   public lastName: string,
   public id: string,
   public userName: string,
   public email: string,
   public emailConfirmed: boolean,
   public phoneNumber: string,
   public twoFactorEnabled: boolean
  ) {}
}
