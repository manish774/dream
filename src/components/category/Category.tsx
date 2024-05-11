import { Box } from "@mui/material";

import CategoryList from "./CategoryList";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { useDataStateContext } from "../context/DataStateContext";
import { categoryList } from "../Utils/Utils";
import CategoryForm from "./CategoryForm";

const Category = () => {
  const { dispatch, state } = useDataStateContext();
  const [refreshToken, setRefreshToken] = useState(state?.refreshToken);

  const refresh = () => {
    setRefreshToken((prev) => prev + 1);
    console.log(refreshToken, "dddddd");
  };

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
  }, [dispatch, refreshToken]);

  return (
    <>
      <CategoryForm refresh={refresh} />
      <CategoryList refresh={refresh} />
    </>
  );
};

export default Category;
