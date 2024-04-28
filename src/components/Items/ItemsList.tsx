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
import { collection, getDocs, addDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/config";
import { ICategoryProps, IItems } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";

const ItemsList = () => {
  const { state, dispatch } = useDataStateContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const calculatePrice = state?.items?.reduce(
      (acc, curr) => acc + curr.price,
      0
    );
    setTotalPrice(calculatePrice);
  }, [state]);

  return (
    <div>
      <Grid>
        <h3>Categories</h3>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(state?.items || []).map((row: IItems) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" width={"20px"}>
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.category_id}</TableCell>
                  <TableCell align="left">{row.price}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <h3>Total: {totalPrice}</h3>
      </Grid>
    </div>
  );
};

export default ItemsList;
