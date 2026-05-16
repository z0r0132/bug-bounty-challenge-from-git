export interface User {
  firstName?: string;
  lastName?: string;
  eMail?: string;
}

export type StoredProfile = Partial<
  Pick<User, "firstName" | "lastName" | "eMail">
>;
