import { getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ICategoryProps } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { categoryDoc, categoryList, TModes } from "../Utils/Utils";
import "../Items/items.scss";
import "./Category.scss";
import { Modal } from "../Modal";

import { Table } from "@manish774/smarty-ui";

const CategoryList = ({
  refresh,
  handleMode,
}: {
  refresh: () => any;
  handleMode: (newMode: TModes, id: string) => any;
}) => {
  const { dispatch } = useDataStateContext();
  const [category, setCategory] = useState<ICategoryProps[]>([]);
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

  const onEdit = (id: string) => {
    handleMode("EDIT", id);
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
              highLight: {
                bgColor: "rebeccapurple",
                color: "default",
              },
            },
            {
              id: "edit",
              name: "",
              highLight: {
                bgColor: "rebeccapurple",
                color: "default",
              },
              render: (row) => {
                return (
                  <EditIcon
                    onClick={() => {
                      row.id && onEdit(row?.id);
                    }}
                  />
                );
              },
            },
            {
              id: "delete",
              name: "",
              highLight: {
                bgColor: "rebeccapurple",
                color: "default",
              },
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
