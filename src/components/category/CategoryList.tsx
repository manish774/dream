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
import { ICategoryProps } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";

const CategoryList = () => {
  const { state, dispatch } = useDataStateContext();
  const [category, setCategory] = useState<ICategoryProps[]>([]);
  const categoryList = collection(db, "category");

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await getDocs(categoryList);
        const categoryData = data?.docs?.map((doc) => doc?.data());
        setCategory(categoryData as ICategoryProps[]);
      } catch (e) {
        console.log(e);
      }
    };
    getCategory();
  }, []);

  return (
    <div>
      <Grid>
        <h3>Categories</h3>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell width={"20px"}>Id</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(state?.category || []).map((row: ICategoryProps) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

export default CategoryList;
