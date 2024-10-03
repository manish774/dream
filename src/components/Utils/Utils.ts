import { collection, doc } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { IItems } from "../context/DataStateModels";

export const categoryList = collection(db, "category");

export const categoryDoc = (id: string) => doc(db, "category", id);
export const itemDoc = (id: string) => doc(db, "Items", id);
export const itemList = collection(db, "Items");
export type TModes = "ADD" | "EDIT";

export interface IItemNCategoryFormProps {
  mode: TModes;
  id?: string;
  handleMode?: (newMode: TModes, id: string) => any;
}
