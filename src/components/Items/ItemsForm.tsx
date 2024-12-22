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
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { IItems } from "../context/DataStateModels";
// import { db } from "../../Firebase/config";
import { getFirebaseServices } from "../../Firebase/config";
import { useDataStateContext } from "../context/DataStateContext";
import {
  IItemNCategoryFormProps,
  itemDoc,
  itemList,
  TModes,
} from "../Utils/Utils";
import { Skeleton, XFileReader } from "@manish774/smarty-ui";
import UploadIcon from "@mui/icons-material/Upload";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useFireBase } from "../../context/FirebaseConfigContext";

const ItemsForm = ({ mode, id, handleMode }: IItemNCategoryFormProps) => {
  const { dispatch, state } = useDataStateContext();
  const [refreshToken, setRefreshToken] = useState<number>(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const { state: firebaseState } = useFireBase();
  // const getFirebaseServices()
  const defaultDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const db = getFirebaseServices(firebaseState.userId).db;
  const categoryList = useMemo(
    () => collection(db, "category"),
    [firebaseState]
  );

  console.log(firebaseState);
  const initData = {
    name: "",
    description: "",
    price: "",
    category: "",
    date: defaultDateTime(),
    revisit: "No",
    pmode: "PhonePe",
  };

  const [item, setItem] = useState<IItems>(initData);

  const addItem = async () => {
    setIsFormValid(false);
    try {
      const adding = await addDoc(itemList(db), item);

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
    dispatch({ type: "loading", payload: { type: "category", status: true } });

    const getCategory = async () => {
      try {
        const data = await getDocs(categoryList);
        const categoryData: any = data?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        categoryData?.length &&
          dispatch({ type: "addCategory", payload: categoryData });
        setItem(initData);
        dispatch({
          type: "loading",
          payload: { type: "category", status: false },
        });
      } catch (e) {
        console.log(e);
      }
    };
    getCategory();
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: "loading", payload: { type: "items", status: true } });
    const getItems = async () => {
      try {
        const data = await getDocs(
          query(itemList(db), orderBy("date", "desc"))
        );
        const itemData: any = data?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
          isEdit: false,
        }));
        itemData?.length && dispatch({ type: "addItems", payload: itemData });
        dispatch({
          type: "loading",
          payload: { type: "items", status: false },
        });
      } catch (e) {
        console.log(e);
      }
    };
    getItems();
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
      const { category, price, description, name, date, revisit, pmode } =
        state?.items?.find((item) => item?.id === id) as IItems;
      setItem({ category, price, description, name, date, revisit, pmode });
    }
  }, [mode, id, state]);

  const updateItem = () => {
    if (id && mode === "EDIT") {
      try {
        updateDoc(itemDoc(id, db), { ...item });

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

  const handleExelFileUpload = (data) => {
    console.log(data);
  };
  const isCategoryLoading = state?.loading.category;
  return (
    <div>
      <div className="container-item-head">
        <span className="left-item">Add Item</span>
        <button
          className="right-item"
          onClick={(e) => {
            e.preventDefault();
            handleMode("ADD", "");
            setItem(initData);
          }}
        >
          <RefreshIcon />
        </button>
      </div>
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {/* Category */}
          <Grid item xs={12}>
            {!isCategoryLoading ? (
              <FormControl fullWidth>
                <InputLabel id="category-select-label">
                  {isCategoryLoading ? "Loading..." : "Category"}
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
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
            ) : (
              <Skeleton type={"line"} style={{ height: "53px" }} />
            )}
          </Grid>

          {/* Item Name */}
          <Grid item xs={12}>
            {!isCategoryLoading ? (
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
            ) : (
              <Skeleton type={"line"} style={{ height: "53px" }} />
            )}
          </Grid>

          {/* Item Price */}
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              {!isCategoryLoading ? (
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
              ) : (
                <Skeleton type={"line"} style={{ height: "53px" }} />
              )}
            </Grid>

            {/* Date */}
            <Grid item xs={6}>
              {!isCategoryLoading ? (
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
              ) : (
                <Skeleton type={"line"} style={{ height: "53px" }} />
              )}
            </Grid>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            {!isCategoryLoading ? (
              <TextareaAutosize
                minRows={3}
                name="description"
                onChange={handleItems}
                aria-label="Item Description"
                placeholder="Item Description"
                style={{ width: "98%" }}
                value={item?.description}
              />
            ) : (
              <Skeleton type={"line"} style={{ height: "53px" }} />
            )}
          </Grid>

          {/* Revisit and Payment Mode */}
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                {!isCategoryLoading ? (
                  <>
                    <InputLabel id="revisit-select-label">
                      {"Revisit required?"}
                    </InputLabel>
                    <Select
                      labelId="revisit-select-label"
                      id="revisit-select"
                      value={item.revisit || initData?.revisit}
                      label="Revisit"
                      name="revisit"
                      onChange={handleItems}
                    >
                      {["No", "Yes"]?.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <Skeleton type={"line"} style={{ height: "53px" }} />
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                {!isCategoryLoading ? (
                  <>
                    <InputLabel id="pmode-select-label">
                      {"Payment mode"}
                    </InputLabel>
                    <Select
                      labelId="pmode-select-label"
                      id="pmode-select"
                      value={item.pmode || initData?.pmode}
                      label="pmode"
                      name="pmode"
                      onChange={handleItems}
                    >
                      {[
                        "Cash",
                        "PhonePe",
                        "Gpay",
                        "Credit card",
                        "Debit card",
                        "Paytm",
                      ]?.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <Skeleton type={"line"} style={{ height: "53px" }} />
                )}
              </FormControl>
            </Grid>
          </Grid>

          {/* Add/Update Button */}
          <Grid item xs={12}>
            <button
              className={"add-item-btn"}
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
