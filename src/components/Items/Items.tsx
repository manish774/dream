import { Box, Grid } from "@mui/material";
import ItemsList from "./ItemsList";
import ItemsForm from "./ItemsForm";
import { useRef, useState } from "react";
import "./items.scss";
import { TModes } from "../Utils/Utils";

const Items = () => {
  const [mode, setMode] = useState<TModes>("ADD");
  const [editId, setEditId] = useState("");
  const scrollRef = useRef(null);
  const handleEditMode = (newMode: TModes, id: string) => {
    newMode && setMode(newMode);
    id && setEditId(id);
    scrollToElement();
  };

  const scrollToElement = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Box component="form" noValidate sx={{ mt: 0 }} ref={scrollRef}>
        <div className={"item-container"}>
          <ItemsForm
            mode={mode}
            id={mode === "EDIT" ? editId : ""}
            handleMode={handleEditMode}
          />
        </div>
        <div className={"item-table-container"}>
          <ItemsList handleMode={handleEditMode} />
        </div>
      </Box>
    </>
  );
};

export default Items;
