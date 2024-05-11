import { Typography, Box, Grid, TextField, Button } from "@mui/material";
import { addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { categoryList } from "../Utils/Utils";
import { ICategoryProps } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";

const CategoryForm = ({ refresh }: { refresh: () => any }) => {
  const { state, dispatch } = useDataStateContext();
  const [category, setCategory] = useState<ICategoryProps>();

  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const addCategory = async () => {
    setIsButtonDisable(true);
    try {
      await addDoc(categoryList, category);
      category &&
        dispatch({
          type: "addCategory",
          payload: [...state?.category, category],
        });
      setCategory({ name: "" });
      dispatch({ type: "refresh", payload: state?.refreshToken + 1 });
      refresh();
    } catch (e) {
      console.log(e);
    }
    setIsButtonDisable(false);
  };

  const handleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({
      name: e?.target.value,
    });
  };

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
              value={category?.name}
              id="category_name"
              label="category Name"
              onChange={handleCategory}
            />
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isButtonDisable}
            onClick={(e) => {
              e.preventDefault();
              addCategory();
            }}
          >
            Add
          </Button>
        </Grid>
      </Box>
    </div>
  );
};

export default CategoryForm;
