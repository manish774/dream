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
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/config";
import { ICategoryProps } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";
import DeleteIcon from "@mui/icons-material/Delete";

const CategoryList = () => {
  const { state, dispatch } = useDataStateContext();
  const [category, setCategory] = useState<ICategoryProps[]>([]);
  const categoryList = collection(db, "category");

  const deleteCategory = async (id: any) => {
    const categoryDoc = doc(db, "category", id);
    await deleteDoc(categoryDoc);
    dispatch({
      type: "addCategory",
      payload: category?.filter((d) => d?.id !== id),
    });
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await getDocs(categoryList);
        const categoryData = data?.docs?.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        console.log(categoryData);
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
                <TableCell></TableCell>
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
                  <TableCell align="left">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteCategory(row.id);
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
      </Grid>
    </div>
  );
};

export default CategoryList;
