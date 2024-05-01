import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import ItemsList from "./ItemsList";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { IItems } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";

const itemList = collection(db, "Items");
const categoryList = collection(db, "category");
const Items = () => {
  const { dispatch, state } = useDataStateContext();
  const [refreshToken, setRefreshToken] = useState<number>(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const initData = {
    name: "",
    id: 0,
    category_id: "",
    description: "",
    price: "",
    category: "",
    date: "",
  };
  const [item, setItem] = useState<IItems>(initData);

  const addItem = async () => {
    try {
      const adding = await addDoc(itemList, item);
      console.log(adding.id);
      setItem(initData);
      setRefreshToken((prev) => prev + 1);
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
    setIsloading(true);
    const getCategory = async () => {
      setIsFormValid(false);
      try {
        const data = await getDocs(categoryList);
        const categoryData: any = data?.docs?.map((doc) => doc?.data());
        categoryData?.length &&
          dispatch({ type: "addCategory", payload: categoryData });
        setItem(initData);
      } catch (e) {
        console.log(e);
      }
    };
    getCategory();
    setIsloading(false);
  }, [dispatch]);

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
  }, [dispatch, refreshToken]); // Include refreshToken in dependency array

  // Check if all required fields are filled in
  useEffect(() => {
    setIsFormValid(
      item.name !== "" &&
        item.category_id !== "" &&
        item.price !== "" &&
        item.date !== ""
    );
  }, [item]);

  return isLoading ? (
    <>Loading...</>
  ) : (
    <div>
      <Typography component="h1" variant="h5">
        Add Item
      </Typography>
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid container spacing={2}>
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
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
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
              value={item?.name}
              onChange={handleItems}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              autoComplete="given-name"
              name="price"
              required
              fullWidth
              id="price"
              type="number"
              label="Item Price"
              value={item?.price}
              onChange={handleItems}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              autoComplete="given-name"
              name="date"
              required
              fullWidth
              id="date"
              type="date"
              label="Date"
              value={item?.date}
              onChange={handleItems}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextareaAutosize
              minRows={2}
              name="description"
              onChange={handleItems}
              aria-label="Item Description"
              placeholder="Item Description"
              style={{ width: "100%" }}
              value={item?.description}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <button
              type="submit"
              style={{ width: "100%", padding: "20px" }}
              onClick={(e) => {
                e.preventDefault();
                addItem();
              }}
              disabled={!isFormValid} // Disable button if form is not valid
            >
              Add
            </button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <ItemsList />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Items;
