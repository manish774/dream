import { collection, doc } from "firebase/firestore";
// import { db } from "../../Firebase/config";
import { getFirebaseServices } from "../../Firebase/config";
import { IItems } from "../context/DataStateModels";

// const db = getFirebaseServices("priya").db;
export const categoryList = (db) => collection(db, "category");

export const categoryDoc = (id: string, db: any) => doc(db, "category", id);
export const itemDoc = (id: string, db: any) => doc(db, "Items", id);
export const itemList = (db) => collection(db, "Items");
export type TModes = "ADD" | "EDIT";

export interface IItemNCategoryFormProps {
  mode: TModes;
  id?: string;
  handleMode?: (newMode: TModes, id: string) => any;
}
