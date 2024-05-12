import {
  Grid,
  TableContainer,
  Paper,
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
import { Modal } from "../Modal";
import { Table } from "@manish774/smarty-ui";

const ItemsList = ({
  handleMode,
}: {
  handleMode: (newMode: TModes, id: string) => any;
}) => {
  const { state, dispatch } = useDataStateContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<IItems[]>([]); // State to hold category-wise data
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

  const deleteItem = async () => {
    const itemDoc = doc(db, "Items", selectedIdToDelete);
    await deleteDoc(itemDoc);
    dispatch({
      type: "addItems",
      payload: state?.items?.filter((d) => d?.id !== selectedIdToDelete),
    });
  };

  const getCategoryName = (categoryId: string) => {
    return state?.category?.find((x) => x.id === categoryId)?.name;
  };

  const onEdit = (id: string) => {
    handleMode("EDIT", id);
  };

  const showDialogBox = (id: string) => {
    setSelectedIdToDelete(id);
    setIsDialogOpen(true);
  };

  return (
    <div style={{ width: "400px", overflow: "scroll" }}>
      <>
        <Table
          records={state?.items}
          pageSize={5}
          config={{
            title: "Items List",
            paginationRequired: true,
            columns: [
              {
                name: "name",
                id: "name",
                highLight: { color: "#FF5733" },
                searchable: true,
              },
              {
                name: "category",
                id: "category",
                render: (row) => <>{getCategoryName(row.category)}</>,
                highLight: { color: "#FFDB58" },
              },

              {
                name: "price",
                id: "price",
                highLight: { color: "#90EE90" },
                searchable: true,
              },
              {
                name: "date",
                id: "date",
                render: (row) => <>{formatDate(row?.date)}</>,
              },
              { name: "description", id: "description" },
              {
                name: "",
                id: "",
                render: (row) => (
                  <EditIcon
                    onClick={(e) => {
                      e.preventDefault();
                      row.id && onEdit(row?.id);
                    }}
                  />
                ),
              },
              {
                name: "",
                id: "",
                render: (row) => (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      showDialogBox(row.id);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                ),
              },
            ],
          }}
        />
        {isDialogOpen && (
          <Modal
            isDialogOpen={isDialogOpen}
            component={
              <>
                Are you sure want to delete{" "}
                <h5 style={{ display: "inline" }}>
                  {
                    state?.items?.find((it) => it?.id === selectedIdToDelete)
                      .name
                  }
                </h5>{" "}
                ?
              </>
            }
            dialogSize={"SMALL"}
            onCloseAction={() => {
              setIsDialogOpen(false);
            }}
            submitClick={() => {
              deleteItem();
              setIsDialogOpen(false);
              setSelectedIdToDelete("");
            }}
          />
        )}
      </>

      {/* <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                            showDialogBox(row.id);
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
          {isDialogOpen && (
            <Modal
              isDialogOpen={isDialogOpen}
              component={
                <>
                  Are you sure want to delete{" "}
                  <h5 style={{ display: "inline" }}>
                    {
                      state?.items?.find((it) => it?.id === selectedIdToDelete)
                        .name
                    }
                  </h5>{" "}
                  ?
                </>
              }
              dialogSize={"SMALL"}
              onCloseAction={() => {
                setIsDialogOpen(false);
              }}
              submitClick={() => {
                deleteItem();
                setIsDialogOpen(false);
                setSelectedIdToDelete("");
              }}
            />
          )}
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
      </Paper> */}
      <br />
      <Table
        records={categoryData}
        pageSize={10}
        config={{
          title: "Category wise",
          paginationRequired: true,
          columns: [
            {
              name: "Category",
              id: "category",
              render: (row) => <>{getCategoryName(row.category)}</>,
              highLight: { color: "#FF5733" },
            },
            {
              name: "price",
              id: "price",
              render: (row) => <>{row.price}</>,
              highLight: { color: "#FF5733" },
            },
          ],
        }}
      />
    </div>
  );
};

export default ItemsList;
