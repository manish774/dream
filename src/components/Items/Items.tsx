import { Box, Grid } from "@mui/material";
import ItemsList from "./ItemsList";
import ItemsForm from "./ItemsForm";
import { useRef, useState } from "react";

export type TModes = "ADD" | "EDIT";
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
  console.log(editId, mode);
  return (
    <>
      <Box component="form" noValidate sx={{ mt: 3 }} ref={scrollRef}>
        <Grid item xs={12} sm={12}>
          <ItemsForm
            mode={mode}
            id={mode === "EDIT" ? editId : ""}
            handleMode={handleEditMode}
          />
          <ItemsList handleMode={handleEditMode} />
        </Grid>
      </Box>
    </>
  );
};

export default Items;
