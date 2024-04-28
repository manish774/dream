import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Textarea from "@mui/joy/Textarea";

import ItemsList from "./ItemsList";
import { ReactNode, useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { ICategoryProps, IItems } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";
const itemList = collection(db, "Items");

const Items = () => {
  const { dispatch, state } = useDataStateContext();
  const [item, setItem] = useState<IItems>({
    name: "",
    id: 0,
    category_id: 0,
    description: "",
    price: 0,
  });

  const addItem = async () => {
    try {
      const adding = await addDoc(itemList, item);
      console.log(adding.id);
    } catch (e) {
      console.log(e);
    }
  };

  const handleItems = (e: any) => {
    const inputType = e?.target.name;
    setItem((prev) => ({
      ...prev,
      id: Math.floor(Math.random() * 999999999),
      [inputType]: e.target.value,
    }));
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await getDocs(itemList);
        const itemData: any = data?.docs?.map((doc) => doc?.data());
        itemData?.length && dispatch({ type: "addItems", payload: itemData });
        console.log(itemData);
      } catch (e) {
        console.log(e);
      }
    };
    getCategory();
  }, [dispatch]);

  return (
    <div>
      <Typography component="h1" variant="h5">
        Add Item
      </Typography>
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={item?.category_id}
              label="Category"
              name="category_id"
              onChange={handleItems}
            >
              {state?.category?.map((cat) => (
                <MenuItem value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            autoComplete="given-name"
            name="name"
            required
            fullWidth
            id="name"
            label="Item Name"
            autoFocus
            onChange={handleItems}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            autoComplete="given-name"
            name="price"
            required
            fullWidth
            id="name"
            type="number"
            label="Item Price"
            autoFocus
            onChange={handleItems}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Textarea minRows={2} name="description" onChange={handleItems} />
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={(e) => {
            e.preventDefault();
            addItem();
          }}
        >
          Add
        </Button>

        <ItemsList />
      </Box>
    </div>
  );
};

export default Items;
