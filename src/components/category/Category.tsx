import { Box } from "@mui/material";

import CategoryList from "./CategoryList";
import { useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { useDataStateContext } from "../context/DataStateContext";
import { categoryList } from "../Utils/Utils";
import CategoryForm from "./CategoryForm";

const Category = () => {
  const { dispatch, state } = useDataStateContext();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await getDocs(categoryList);
        const categoryData: any = data?.docs?.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        categoryData?.length &&
          dispatch({ type: "addCategory", payload: categoryData });
      } catch (e) {
        console.log(e);
      }
    };
    getCategory();
  }, [dispatch]);

  return (
    <>
      <CategoryForm />
      <CategoryList />
    </>
  );
};

export default Category;
