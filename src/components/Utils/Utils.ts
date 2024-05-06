import { collection, doc } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { IItems } from "../context/DataStateModels";

export const categoryList = collection(db, "category");

export const categoryDoc = (id: string) => doc(db, "category", id);
export const itemDoc = (id: string) => doc(db, "Items", id);
export const itemList = collection(db, "Items");

export const createCategoryWiseData = (items: IItems[]) => {
  return items.reduce((acc: IItems[], curr: IItems) => {
    const index = acc.findIndex((x) => curr?.category === x.category);

    if (index !== -1) {
      acc[index] = {
        ...acc[index],
        category: curr?.category,
        price:
          parseFloat(String(acc[index].price)) +
          parseFloat(String(curr?.price)),
      };
    } else {
      acc.push({
        ...curr,
        category: curr.category,
        price: curr.price,
      });
    }

    return acc;
  }, []);
};
