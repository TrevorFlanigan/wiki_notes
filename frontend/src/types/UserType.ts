type UserType = {
  username: string;
  name: string;
  phone_number?: string;
  email: string;
};

export default UserType;

export type UpdateUserInput = {
  username: string;
  name?: string;
  phone_number?: string;
  email?: string;
};

export type GetUserInput = {
  username: string;
};
