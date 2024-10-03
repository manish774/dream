import { Dispatch } from "react";

export type ICategoryProps = {
  name: string;
  id?: string;
  isEdit?: boolean;
  oldValue?: string;
};

export interface ChildrenProps {
  category: string;
  price: string | number;
  name: string;
}
export type IItems = ICategoryProps & {
  price: number | string;
  description: string;
  category: string;
  date: string;
  children?: ChildrenProps[];
  revisit: string;
};

export interface IData {
  category: ICategoryProps[];
  items: IItems[];
  isLoggedIn: boolean;
  refreshToken?: number;
  loading: { items: boolean; category: boolean };
}

export type IType = { type: "category" | "items"; status: boolean };
export type AppAction =
  | { type: "addCategory"; payload: ICategoryProps[] | [] }
  | {
      type: "addItems";
      payload: IItems[];
    }
  | {
      type: "auth";
      payload: boolean;
    }
  | {
      type: "refresh";
      payload: number;
    }
  | {
      type: "loading";
      payload: IType;
    };

export interface AppContextType {
  state: IData;
  dispatch: Dispatch<AppAction>;
}
