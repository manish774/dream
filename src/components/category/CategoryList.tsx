import {
  Grid,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ICategoryProps } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { categoryDoc, categoryList } from "../Utils/Utils";
import "../Items/items.scss";
import "./Category.scss";
import { Modal } from "../Modal";

import { Table } from "@manish774/smarty-ui";

const CategoryList = ({ refresh }: { refresh: () => any }) => {
  const { state, dispatch } = useDataStateContext();
  const [category, setCategory] = useState<ICategoryProps[]>([]);
  const [refreshToken, setRefreshToken] = useState(0);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const deleteCategory = async () => {
    if (selectedIdToDelete) {
      await deleteDoc(categoryDoc(selectedIdToDelete));
      dispatch({
        type: "addCategory",
        payload: category?.filter((d) => d?.id !== selectedIdToDelete),
      });
      refresh();
    }
  };

  const showDialogBox = (id: string) => {
    setSelectedIdToDelete(id);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    console.log("first");
    const getCategory = async () => {
      try {
        const data = await getDocs(categoryList);
        const categoryData = data?.docs?.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          isEdit: false,
          oldValue: doc.data().name,
        }));
        setCategory(categoryData as ICategoryProps[]);
        console.log(categoryData);
      } catch (e) {
        console.log(e);
      }
    };
    getCategory();
  }, [refresh]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input field when isEdit is true
    if (category.some((item) => item.isEdit) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [category]);

  const onEdit = (id: string) => {
    const enableEditModeForId = category?.map((m) => {
      return m.id === id
        ? {
            ...m,
            isEdit: true,
          }
        : { ...m, isEdit: false };
    });
    setCategory(enableEditModeForId as ICategoryProps[]);
  };

  const onChangeHandler = (id: string, value: string) => {
    console.log(id);
    const enableEditModeForId = category?.map((m) => {
      debugger;
      return m.id === id
        ? {
            ...m,
            name: value,
          }
        : { ...m };
    });
    setCategory(enableEditModeForId as ICategoryProps[]);
  };

  const saveEditedCategory = (id: string, value: string) => {
    updateDoc(categoryDoc(id), { name: value });
    const updatedCatagories = category?.map((d) =>
      d?.id === id ? { ...d, name: value, isEdit: false } : { ...d }
    );
    dispatch({
      type: "addCategory",
      payload: updatedCatagories,
    });
    setCategory(updatedCatagories);
    setRefreshToken((prev) => prev + 1);
  };

  return (
    <>
      <Table
        records={category}
        config={{
          title: "Category",
          columns: [
            {
              id: "name",
              name: "name",
              searchable: true,
              render: (row) => {
                return (
                  <input
                    key={row?.id}
                    ref={inputRef}
                    value={row.name}
                    disabled={!row?.isEdit}
                    onChange={(e) =>
                      row?.id && onChangeHandler(row?.id, e.target?.value)
                    }
                    className="editCategoryInput"
                    id={`edit-${row?.id}`}
                    onBlur={(e) => {
                      row?.id && saveEditedCategory(row?.id, e.target?.value);
                    }}
                  />
                );
              },
            },
            {
              id: "edit",
              name: "",
              render: (row) => {
                return (
                  <EditIcon
                    onClick={(e) => {
                      row.id && onEdit(row?.id);
                    }}
                  />
                );
              },
            },
            {
              id: "delete",
              name: "",
              render: (row) => {
                return (
                  <DeleteIcon
                    onClick={(e) => {
                      e.preventDefault();
                      showDialogBox(row.id);
                    }}
                  />
                );
              },
            },
          ],
          paginationRequired: true,
        }}
        pageSize={10}
      />
      {isDialogOpen && (
        <Modal
          isDialogOpen={isDialogOpen}
          component={
            <>
              Are you sure want to delete{" "}
              <h5 style={{ display: "inline" }}>
                {category?.find((cat) => cat?.id === selectedIdToDelete).name}
              </h5>{" "}
              ?
            </>
          }
          dialogSize={"SMALL"}
          onCloseAction={() => {
            setIsDialogOpen(false);
          }}
          submitClick={() => {
            deleteCategory();
            setIsDialogOpen(false);
            setSelectedIdToDelete("");
          }}
        />
      )}
    </>
    // <Paper sx={{ width: "100%", overflow: "hidden" }}>
    //   <Grid>
    //     <h3>Categories</h3>
    //     <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
    //       <Table stickyHeader aria-label="sticky table">
    //         <TableHead className={"table-header"}>
    //           <TableRow>
    //             {/* <TableCell>Id</TableCell> */}
    //             <TableCell>Name</TableCell>
    //             <TableCell></TableCell>
    //             <TableCell></TableCell>
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {(category || []).map((row: ICategoryProps) => (
    //             <TableRow
    //               key={row.id}
    //               sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //             >
    //               {/* <TableCell align="left">{row.id}</TableCell> */}
    //               <TableCell align="left">
    //                 <input
    //                   key={row?.id}
    //                   ref={inputRef}
    //                   value={row.name}
    //                   disabled={!row?.isEdit}
    //                   onChange={(e) =>
    //                     row?.id && onChangeHandler(row?.id, e.target?.value)
    //                   }
    //                   className="editCategoryInput"
    //                   id={`edit-${row?.id}`}
    //                   onBlur={(e) => {
    //                     row?.id && saveEditedCategory(row?.id, e.target?.value);
    //                   }}
    //                 />
    //               </TableCell>
    //               <TableCell align="left">
    //                 <DeleteIcon
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     showDialogBox(row.id);
    //                   }}
    //                 />
    //               </TableCell>
    //               <TableCell align="left">
    //                 <EditIcon
    //                   onClick={(e) => {
    //                     row.id && onEdit(row?.id);
    //                   }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //   </Grid>
    // {isDialogOpen && (
    //   <Modal
    //     isDialogOpen={isDialogOpen}
    //     component={
    //       <>
    //         Are you sure want to delete{" "}
    //         <h5 style={{ display: "inline" }}>
    //           {category?.find((cat) => cat?.id === selectedIdToDelete).name}
    //         </h5>{" "}
    //         ?
    //       </>
    //     }
    //     dialogSize={"SMALL"}
    //     onCloseAction={() => {
    //       setIsDialogOpen(false);
    //     }}
    //     submitClick={() => {
    //       deleteCategory();
    //       setIsDialogOpen(false);
    //       setSelectedIdToDelete("");
    //     }}
    //   />
    // )}
    // </Paper>
  );
};

export default CategoryList;
