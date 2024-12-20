import React, { createContext, useContext, useReducer, useState } from "react";

interface IfirebaseConfig {
  userId: string;
}
interface IContextValue {
  state: IfirebaseConfig;
  dispatch: React.Dispatch<IAction>;
}

const FirebaseConfigContext = createContext<IContextValue | undefined>(
  undefined
);

const initialValue = {
  userId: "manish",
};
interface IAction {
  type: "changeId";
  payload: any;
}

export const reducer = (state: IfirebaseConfig, action: IAction) => {
  switch (action.type) {
    case "changeId":
      return { userId: action.payload };
    default:
      return state;
  }
};

export const FirebaseConfigContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  return (
    <FirebaseConfigContext.Provider value={{ state, dispatch }}>
      {children}
    </FirebaseConfigContext.Provider>
  );
};

export const useFireBase = () => {
  return useContext(FirebaseConfigContext);
};
