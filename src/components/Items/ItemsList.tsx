import {
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IItems } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase/config";

const ItemsList = () => {
  const { state, dispatch } = useDataStateContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<IItems[]>([]); // State to hold category-wise data
  const [showCategoryWiseData, setShowCategoryWiseData] = useState(false); // State to toggle showing category-wise data

  useEffect(() => {
    const calculatePrice = state?.items?.reduce(
      (acc, curr) => acc + parseFloat(String(curr.price) || "0"), // Convert curr.price to string before parsing
      0
    );
    setTotalPrice(calculatePrice);
  }, [state]);

  useEffect(() => {
    if (state.items) {
      const categoryWiseData = state.items.reduce(
        (acc: IItems[], curr: IItems) => {
          const index = acc.findIndex(
            (x) => curr?.category_id === x.category_id
          );

          if (index !== -1) {
            acc[index] = {
              ...acc[index],
              category_id: curr?.category_id,
              price:
                parseFloat(String(acc[index].price)) +
                parseFloat(String(curr?.price)),
            };
          } else {
            acc.push({
              ...curr,
              category_id: curr.category_id,
              price: curr.price,
            });
          }

          return acc;
        },
        []
      );

      setCategoryData(categoryWiseData);
    }
  }, [state.items]);

  const formatDate = (date: string) => new Date(date).toDateString();

  const deleteItem = async (id: any) => {
    const categoryDoc = doc(db, "Items", id);
    await deleteDoc(categoryDoc);
    dispatch({
      type: "addItems",
      payload: state?.items?.filter((d) => d?.id !== id),
    });
  };

  return (
    <div style={{ height: "500px" }}>
      <Grid>
        <h3>Items</h3>
        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ background: "#f0f0f0" }}>
                <TableRow>
                  {/* <TableCell>Id</TableCell> */}
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(state?.items || []).map((row: IItems) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* <TableCell align="left" width={"20px"}>
                      {row.id}
                    </TableCell> */}
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.category_id}</TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                    <TableCell align="left">{formatDate(row.date)}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">
                      {" "}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteItem(row.id);
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <h3>Total: {totalPrice}</h3>
      </Grid>

      <Grid>
        <h3>Category wise Data</h3>
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ background: "#f0f0f0" }}>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryData.map((row: IItems) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row.category_id}</TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <h3>Total: {totalPrice}</h3>
      </Grid>
    </div>
  );
};

export default ItemsList;
