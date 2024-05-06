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
import { createCategoryWiseData } from "../Utils/Utils";
import EditIcon from "@mui/icons-material/Edit";
import "./items.scss";
import { TModes } from "./Items";

const ItemsList = ({
  handleMode,
}: {
  handleMode: (newMode: TModes, id: string) => any;
}) => {
  const { state, dispatch } = useDataStateContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<IItems[]>([]); // State to hold category-wise data

  useEffect(() => {
    const calculatePrice = state?.items?.reduce(
      (acc, curr) => acc + parseFloat(String(curr.price) || "0"),
      0
    );
    setTotalPrice(calculatePrice);
  }, [state]);

  useEffect(() => {
    //For category wise
    if (state.items) {
      const categoryWiseData = createCategoryWiseData(state?.items);
      setCategoryData(categoryWiseData);
    }
  }, [state.items]);

  const formatDate = (date: string) =>
    `${new Date(date).toDateString()} -  ${new Date(
      date
    ).toLocaleTimeString()}`;

  const deleteItem = async (id: any) => {
    const itemDoc = doc(db, "Items", id);
    await deleteDoc(itemDoc);
    dispatch({
      type: "addItems",
      payload: state?.items?.filter((d) => d?.id !== id),
    });
  };

  const getCategoryName = (categoryId: string) => {
    return state?.category?.find((x) => x.id === categoryId)?.name;
  };

  const onEdit = (id: string) => {
    handleMode("EDIT", id);
  };

  return (
    <div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid>
          <h3>Items</h3>
          <div>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead className={"table-header"}>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(state?.items || []).map((row: IItems) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">
                        {getCategoryName(row.category)}
                      </TableCell>
                      <TableCell align="left">{row.price}</TableCell>
                      <TableCell align="left">{formatDate(row.date)}</TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="left">
                        <EditIcon
                          onClick={(e) => {
                            e.preventDefault();
                            row.id && onEdit(row?.id);
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">
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
        </Grid>
        <h3>Total: {totalPrice}</h3>
      </Paper>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid>
          <h3>Category wise Data</h3>
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead className={"table-header1"}>
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
                    <TableCell align="left">
                      {getCategoryName(row.category)}
                    </TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <h3>Total: {totalPrice}</h3>
        </Grid>
      </Paper>
    </div>
  );
};

export default ItemsList;
