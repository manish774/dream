import { Box } from "@mui/material";

import CategoryList from "./CategoryList";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { useDataStateContext } from "../context/DataStateContext";
import { categoryList, TModes } from "../Utils/Utils";
import CategoryForm from "./CategoryForm";

const Category = () => {
  const { dispatch, state } = useDataStateContext();
  const [refreshToken, setRefreshToken] = useState(state?.refreshToken);
  const [editId, setEditId] = useState("");
  const [mode, setMode] = useState<TModes>("ADD");

  const refresh = () => {
    setRefreshToken((prev) => prev + 1);
    console.log(refreshToken, "dddddd");
  };

  const handleEditMode = (newMode: TModes, id: string) => {
    newMode && setMode(newMode);
    id && setEditId(id);
    scrollToElement();
  };

  const scrollToElement = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
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
    <div>
      <CategoryForm
        refresh={refresh}
        mode={mode}
        id={mode === "EDIT" ? editId : ""}
        handleMode={handleEditMode}
      />
      <CategoryList refresh={refresh} handleMode={handleEditMode} />
    </div>
  );
};

export default Category;
