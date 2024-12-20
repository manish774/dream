import { useEffect, useState } from "react";
import { IItems } from "../context/DataStateModels";
import { useDataStateContext } from "../context/DataStateContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDoc, doc } from "firebase/firestore";

import { getFirebaseServices } from "../../Firebase/config";
import EditIcon from "@mui/icons-material/Edit";
import "./items.scss";
import { Modal } from "../Modal";
import { Badge, Table, Tree } from "@manish774/smarty-ui";
import { TModes } from "../Utils/Utils";
import { useFireBase } from "../../context/FirebaseConfigContext";

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
  const isItemsLoading = state?.loading?.items;
  const { state: firebaseState } = useFireBase();
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
    const itemDoc = doc(
      getFirebaseServices(firebaseState.userId).db,
      "Items",
      selectedIdToDelete
    );
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

  const createCategoryWiseData = (items: IItems[]) => {
    return items.reduce((acc: IItems[], curr: IItems) => {
      const index = acc.findIndex((x) => curr?.category === x.category);

      if (index !== -1) {
        acc[index] = {
          ...acc[index],
          category: curr?.category,
          price:
            parseFloat(String(acc[index].price)) +
            parseFloat(String(curr?.price)),
          children: [...acc[index].children, { ...curr, category: curr?.name }],
        };
      } else {
        acc.push({
          ...curr,
          category: curr.category,
          name: getCategoryName(curr?.category),
          price: curr.price,
          children: [{ ...curr, category: curr?.name }],
        });
      }

      return acc;
    }, []);
  };

  const columnsToBeShown = [
    {
      name: "Name",
      id: "name",
      highLight: { bgColor: "#FF5733", color: "white" },
      searchable: true,
      sortable: true,
    },
    {
      name: "Category",
      id: "category",
      render: (row) => getCategoryName(row.category),
      highLight: { bgColor: "#FFDB58", color: "default" },
      searchable: true,
    },

    {
      name: "Price",
      id: "price",
      sortable: true,
      highLight: { bgColor: "#90EE90", color: "default" },
      render: (row) =>
        !isItemsLoading ? (
          <>
            &#8377;
            <Badge type={"bordered"} theme={"warning"} label={row?.price} />
          </>
        ) : (
          ""
        ),
      searchable: true,
    },
    {
      name: "Date",
      id: "date",
      render: (row) => (
        <>{isItemsLoading ? "Loading..." : formatDate(row?.date)}</>
      ),
    },
    { name: "description", id: "description", searchable: true },
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
  ];

  return (
    <div style={{}}>
      <>
        {isItemsLoading ? (
          <Table
            records={[
              {
                name: "",
                category: "",
                price: "",
                date: "Loading...",
                description: "",
              },
            ]}
            config={{
              title: "",
              columns: columnsToBeShown,
            }}
            pageSize={5}
          />
        ) : (
          <Table
            records={state?.items}
            pageSize={5}
            config={{
              filterProps: {
                enable: true,
                columnsToFilter: [
                  {
                    name: "revisit",
                    type: "dropdown",
                    payload: [
                      { name: "Yes", value: "Yes" },
                      { name: "No", value: "No" },
                    ],
                  },
                  {
                    name: "category",
                    type: "dropdown",
                    payload: state?.category?.map((cat) => ({
                      name: cat.name,
                      value: cat.id,
                    })),
                  },
                ],
              },
              title: "Items List",
              paginationRequired: true,
              columns: columnsToBeShown,
              rowHighLight: {
                columnName: "revisit",
                bgColor: "rgb(255, 219, 88)",
                value: "Yes",
              },
            }}
          />
        )}
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
        <h3>
          Total: &#8377;{" "}
          <Badge
            size={"large"}
            theme={"warning"}
            label={totalPrice.toString()}
            type={"bordered"}
          />
        </h3>
      </>
      <br />
      <Tree
        records={categoryData}
        pageSize={10}
        config={{
          title: "Category wise",
          paginationRequired: true,
          columns: [
            {
              name: "Category",
              id: "name",
              render: (row) => <>{getCategoryName(row.category)}</>,
              highLight: { bgColor: "#FFDB58", color: "default" },
              searchable: true,
            },
            {
              name: "Price",
              id: "price",
              sortable: true,
              render: (row) => <>{row.price}</>,
              highLight: { bgColor: "#90EE90", color: "default" },
              searchable: true,
            },
          ],
        }}
      />
    </div>
  );
};

export default ItemsList;
