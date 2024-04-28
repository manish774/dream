import { useReducer } from "react";
import { DataState, dataReducer, defaultValue } from "./DataStateContext";
import React from "react";
const DataStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(dataReducer, defaultValue);

  return (
    <DataState.Provider value={{ state, dispatch }}>
      {children}
    </DataState.Provider>
  );
};

export default DataStateProvider;
