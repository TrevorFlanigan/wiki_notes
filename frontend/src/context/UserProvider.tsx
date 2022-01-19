import React, { ReactNode, useEffect, useState } from "react";
import fetchUserProfile from "../api/fetchUserProfile";
import updateUserProfile from "../api/updateUserProfile";
import UserType, { UpdateUserInput } from "../types/UserType";
import useAuth from "./useAuth";

export type UserProfileContextType = UserType & {
  loading: boolean;
  set: any;
};

const UserProfileContext = React.createContext({} as UserProfileContextType);

export const UserProfileProvider = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserType>();
  const [loading, setLoading] = useState(true);

  const set = async (input: UpdateUserInput) => {
    await updateUserProfile(input);
    setProfile({ ...profile, ...input });
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchUserProfile({ username: user.username }).then(
        (userProfile: UserType) => {
          if (userProfile) {
            setProfile(userProfile);
          } else {
            throw new Error("User not found");
          }
          setLoading(() => false);
        }
      );
    }
  }, [user]);

  return (
    <UserProfileContext.Provider
      value={{
        ...profile,
        loading,
        set,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileContext;
