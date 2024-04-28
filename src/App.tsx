import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import Category from "./components/category/Category";
import Header from "./components/Header";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Items from "./components/Items/Items";

function App() {
  return (
    <div className="app-main-container">
      <div className="app-form-container">
        <Header />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Cataegory
          </AccordionSummary>
          <AccordionDetails>
            <Category />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Items
          </AccordionSummary>
          <AccordionDetails>
            <Items />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}

export default App;
