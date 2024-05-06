import { Dispatch } from "react";

export type ICategoryProps = {
  name: string;
  id?: string;
  isEdit?: boolean;
  oldValue?: string;
};

export type IItems = ICategoryProps & {
  price: number | string;
  description: string;
  category: string;
  date: string;
};

export interface IData {
  category: ICategoryProps[];
  items: IItems[];
  isLoggedIn: boolean;
}

export type AppAction =
  | { type: "addCategory"; payload: ICategoryProps[] | [] }
  | {
      type: "addItems";
      payload: IItems[];
    }
  | {
      type: "auth";
      payload: boolean;
    };

export interface AppContextType {
  state: IData;
  dispatch: Dispatch<AppAction>;
}
