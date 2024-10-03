import { Typography, Box, Grid, TextField, Button } from "@mui/material";
import { addDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { categoryDoc, categoryList } from "../Utils/Utils";
import { ICategoryProps } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";
import { IItemNCategoryFormProps } from "../Utils/Utils";

const CategoryForm = ({
  refresh,
  mode,
  id,
  handleMode,
}: {
  refresh: () => any;
} & IItemNCategoryFormProps) => {
  const { state, dispatch } = useDataStateContext();
  const [category, setCategory] = useState<ICategoryProps>();
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [refreshToken, setRefreshToken] = useState<number>(0);

  const addCategory = async () => {
    if (category?.name) {
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
    }
  };

  const handleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({
      name: e?.target.value,
    });
  };

  useEffect(() => {
    if (mode === "EDIT" && id !== "") {
      const { name } = state?.category?.find(
        (cat) => cat?.id === id
      ) as ICategoryProps;
      setCategory({ name });
    }
  }, [mode, id, state]);

  const updateCategory = () => {
    if (id && mode === "EDIT") {
      try {
        updateDoc(categoryDoc(id), { name: category?.name });
        const updatedCatagories = state?.category?.map((d) =>
          d?.id === id
            ? { ...d, name: category?.name, isEdit: false }
            : { ...d }
        );
        dispatch({
          type: "addCategory",
          payload: updatedCatagories,
        });
        handleMode && handleMode("ADD", "");
        setCategory({ name: "" });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <Typography component="h1" variant="h5">
        Add Category
      </Typography>
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <TextField
              autoComplete="given-name"
              name="name"
              required
              fullWidth
              label="category Name"
              value={category?.name}
              id="name"
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
              mode === "ADD" ? addCategory() : updateCategory();
            }}
          >
            {mode === "ADD" ? "Add" : "Update"}
          </Button>
        </Grid>
      </Box>
    </div>
  );
};

export default CategoryForm;
