import { useContext } from "react";
import UserProfileContext from "./UserProvider";

const useUserProfile = () => {
  const user = useContext(UserProfileContext);
  if (!user)
    throw new Error("useUserProfile must be used within a UserProvider");
  return user;
};

export default useUserProfile;
