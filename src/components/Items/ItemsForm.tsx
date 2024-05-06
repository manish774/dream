import {
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { IItems } from "../context/DataStateModels";
import { db } from "../../Firebase/config";
import { useDataStateContext } from "../context/DataStateContext";
import { TModes } from "./Items";
import { itemDoc, itemList } from "../Utils/Utils";

const categoryList = collection(db, "category");

interface IItemFormProps {
  mode: TModes;
  id?: string;
  handleMode?: (newMode: TModes, id: string) => any;
}
const ItemsForm = ({ mode, id, handleMode }: IItemFormProps) => {
  const { dispatch, state } = useDataStateContext();
  const [refreshToken, setRefreshToken] = useState<number>(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const scrollToRef = useRef(null);

  const defaultDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initData = {
    name: "",
    description: "",
    price: "",
    category: "",
    date: defaultDateTime(),
  };

  const [item, setItem] = useState<IItems>(initData);
  console.log(mode, id);
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
      [inputType]: e.target.value,
    }));
  };

  useEffect(() => {
    const getCategory = async () => {
      setIsFormValid(false);
      try {
        const data = await getDocs(categoryList);
        const categoryData: any = data?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        categoryData?.length &&
          dispatch({ type: "addCategory", payload: categoryData });
        setItem(initData);
      } catch (e) {
        console.log(e);
      }
    };
    getCategory();
  }, [dispatch]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await getDocs(query(itemList, orderBy("date", "desc")));
        const itemData: any = data?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
          isEdit: false,
        }));
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
        item.category !== "" &&
        item.price !== "" &&
        item.date !== ""
    );
  }, [item]);

  useEffect(() => {
    if (mode === "EDIT" && id !== "") {
      debugger;
      const { category, price, description, name, date } = state?.items?.find(
        (item) => item?.id === id
      ) as IItems;
      setItem({ category, price, description, name, date });
    }
  }, [mode, id]);

  const updateItem = () => {
    if (id && mode === "EDIT") {
      try {
        updateDoc(itemDoc(id), { ...item });

        const updatedItems = state?.items?.map((d) =>
          d?.id === id ? { ...item } : { ...d }
        );
        dispatch({
          type: "addItems",
          payload: updatedItems,
        });

        setItem(initData);
        handleMode && handleMode("ADD", "");
        setRefreshToken((prev) => prev + 1);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const scrollToElement = () => {
    if (scrollToRef.current) {
      //@ts-ignore
      scrollToRef?.current?.scrollTo({
        top: 0,
        behavior: "smooth", // Optional, smooth scrolling effect
      });
    }
  };
  return (
    <div>
      <Typography component="h1" variant="h5" ref={scrollToRef}>
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
                value={item?.category}
                label="Category"
                name="category"
                onChange={handleItems}
              >
                {state?.category?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
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
              type="datetime-local"
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
                mode === "ADD" ? addItem() : updateItem();
              }}
              disabled={!isFormValid} // Disable button if form is not valid
            >
              {mode === "ADD" ? "Add" : "Update"}
            </button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ItemsForm;
