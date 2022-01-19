import { CognitoUserInterface } from "@aws-amplify/ui-components";
import { Auth, Hub } from "aws-amplify";

import { useEffect, useState } from "react";
import UserType from "../types/UserType";

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CognitoUserInterface | undefined>();

  const handleAuth = ({ payload }: any) => {
    switch (payload.event) {
      case "signIn":
        return setUser(payload.data);
      case "signOut":
        return setUser(undefined);
      default:
        throw new Error("Unrecognized Auth event");
    }
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(setUser)
      .catch(console.error)
      .then(() => setIsLoading(false));

    Hub.listen("auth", handleAuth);

    return () => Hub.remove("auth", handleAuth);
  }, []);

  return {
    Auth,
    isLoading,
    owner: user ? user.username : null,
    user,
  };
}
