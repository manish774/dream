import { createContext, useContext } from "react";

import { AppAction, AppContextType, IData } from "./DataStateModels";

export const initialNav = [];

export const defaultValue: IData = {
  category: [],
  items: [],
  loading: { items: false, category: false },
  isLoggedIn: false,
  refreshToken: 0,
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
        isLoggedIn: action.payload,
      };
    case "refresh":
      return {
        ...state,
        refreshToken: action.payload,
      };
    case "loading":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload?.type]: action.payload.status,
        },
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
