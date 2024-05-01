import { Box, Button, Grid, TextField, Typography } from "@mui/material";

import CategoryList from "./CategoryList";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { ICategoryProps } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";
const categoryList = collection(db, "category");

const Category = () => {
  const { dispatch, state } = useDataStateContext();
  const [category, setCategory] = useState<ICategoryProps>();

  const addCategory = async () => {
    try {
      const adding = await addDoc(categoryList, category);
      console.log(adding.id);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({
      id: Math.floor(Math.random() * 10000000),
      name: e?.target.value,
    });
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await getDocs(categoryList);
        const categoryData: any = data?.docs?.map((doc) => doc?.data());
        categoryData?.length &&
          dispatch({ type: "addCategory", payload: categoryData });
      } catch (e) {
        console.log(e);
      }
    };
    getCategory();
  }, [dispatch]);

  return (
    <div>
      <Typography component="h1" variant="h5">
        Add Category
      </Typography>
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <TextField
              autoComplete="given-name"
              name="category_name"
              required
              fullWidth
              id="category_name"
              label="category Name"
              onChange={handleCategory}
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={(e) => {
              e.preventDefault();
              addCategory();
            }}
          >
            Add
          </Button>
        </Grid>
        <CategoryList />
      </Box>
    </div>
  );
};

export default Category;
