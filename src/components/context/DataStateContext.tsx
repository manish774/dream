import { createContext, Dispatch, useContext, useReducer } from "react";

import { AppAction, AppContextType, IData } from "./DataStateModels";
import { auth } from "../../Firebase/config";

export const initialNav = [];

export const defaultValue: IData = {
  category: [],
  items: [],
  isLoggedIn: false,
};

export const dataReducer = (state: IData, action: AppAction) => {
  switch (action.type) {
    case "addCategory":
      return {
        ...state,
        category: [...action.payload],
      };
    case "addItems":
      return {
        ...state,
        items: [...action.payload],
      };
    case "auth":
      return {
        ...state,
        auth: action.payload,
      };
    default:
      return state;
  }
};

export const DataState = createContext<AppContextType>({
  state: defaultValue,
  dispatch: () => null,
});

export const useDataStateContext = () => {
  return useContext(DataState);
};
