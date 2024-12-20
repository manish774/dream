import React, { useState } from "react";
import { CardHeader } from "@mui/material";

import { getFirebaseServices } from "../Firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";
import { Box, Grid, TextField } from "@mui/material";
import { useDataStateContext } from "./context/DataStateContext";
import { useFireBase } from "../context/FirebaseConfigContext";
const Header = () => {
  const { dispatch } = useDataStateContext();
  const [user, setUser] = useState<string | undefined | null>();
  const { state } = useFireBase();
  const auth = getFirebaseServices(state.userId).auth;
  const googleProvider = getFirebaseServices(state.userId).googleProvider;
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setUser(auth?.currentUser?.displayName);

      dispatch({
        type: "auth",
        payload: auth?.currentUser?.displayName ? true : false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const signOutWithGoogle = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      {!auth?.currentUser?.displayName && (
        <button onClick={signInWithGoogle}>Sign in</button>
      )}
      {auth?.currentUser?.displayName && (
        <button onClick={signOutWithGoogle}>Logout</button>
      )}
    </div>
  );
};

export default Header;
