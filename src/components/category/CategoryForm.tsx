import { Typography, Box, Grid, TextField, Button } from "@mui/material";
import { addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { categoryList } from "../Utils/Utils";
import { ICategoryProps } from "../context/DataStateModels";

const CategoryForm = () => {
  const [category, setCategory] = useState<ICategoryProps>();

  const addCategory = async () => {
    try {
      await addDoc(categoryList, category);
    } catch (e) {
      console.log(e);
    }
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
      </Box>
    </div>
  );
};

export default CategoryForm;
