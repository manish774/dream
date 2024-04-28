import { Dispatch } from "react";

export type ICategoryProps = {
  name: string;
  id: number;
};

export type IItems = ICategoryProps & {
  category_id: number;
  price: number;
  description: string;
};

export interface IData {
  category: ICategoryProps[];
  items: IItems[];
}

export type AppAction =
  | { type: "addCategory"; payload: ICategoryProps[] | [] }
  | {
      type: "addItems";
      payload: IItems[];
    };

export interface AppContextType {
  state: IData;
  dispatch: Dispatch<AppAction>;
}
